using ProcurementERP.Core.Entities;
using ProcurementERP.Core.Enums;
using ProcurementERP.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ProcurementERP.Api.Services
{
    public interface IPurchaseRequisitionService
    {
        Task<IEnumerable<PurchaseRequisition>> GetAllAsync();
        Task<PurchaseRequisition?> GetByIdAsync(Guid id);
        Task<PurchaseRequisition> CreateAsync(PurchaseRequisition pr);
        Task SubmitForApprovalAsync(Guid id);
    }

    public class PurchaseRequisitionService : IPurchaseRequisitionService
    {
        private readonly ProcurementDbContext _context;
        private readonly IApprovalService _approvalService;

        public PurchaseRequisitionService(ProcurementDbContext context, IApprovalService approvalService)
        {
            _context = context;
            _approvalService = approvalService;
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetAllAsync()
        {
            return await _context.PurchaseRequisitions
                .Include(p => p.Requester)
                .Include(p => p.Department)
                .Include(p => p.Items)
                .ToListAsync();
        }

        public async Task<PurchaseRequisition?> GetByIdAsync(Guid id)
        {
            return await _context.PurchaseRequisitions
                .Include(p => p.Requester)
                .Include(p => p.Department)
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<PurchaseRequisition> CreateAsync(PurchaseRequisition pr)
        {
            var user = await _context.Users.FindAsync(pr.RequesterId);
            if (user == null || user.DepartmentId == null)
            {
                throw new InvalidOperationException("User must belong to a department to create a PR");
            }

            pr.DepartmentId = user.DepartmentId.Value;
            pr.PRNumber = await GeneratePRNumber();
            pr.CreatedAt = DateTime.UtcNow;
            pr.Status = PRStatus.DRAFT;

            foreach (var item in pr.Items)
            {
                item.TotalPrice = item.Quantity * item.UnitPrice;
            }
            pr.TotalAmount = pr.Items.Sum(i => i.TotalPrice);

            _context.PurchaseRequisitions.Add(pr);
            await _context.SaveChangesAsync();
            return pr;
        }

        public async Task SubmitForApprovalAsync(Guid id)
        {
            var pr = await _context.PurchaseRequisitions.FindAsync(id);
            if (pr != null && pr.Status == PRStatus.DRAFT)
            {
                pr.Status = PRStatus.PENDING_APPROVAL;
                await _context.SaveChangesAsync();
                await _approvalService.CreateApprovalWorkflowAsync(id);
            }
        }

        private async Task<string> GeneratePRNumber()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"PR-{year}-";
            var lastPR = await _context.PurchaseRequisitions
                .Where(p => p.PRNumber.StartsWith(prefix))
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            int nextId = 1;
            if (lastPR != null)
            {
                if (int.TryParse(lastPR.PRNumber.AsSpan(prefix.Length), out int lastId))
                {
                    nextId = lastId + 1;
                }
            }

            return $"{prefix}{nextId:D5}";
        }
    }
}
