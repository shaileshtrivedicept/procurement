using ProcurementERP.Core.Entities;
using ProcurementERP.Core.Enums;
using ProcurementERP.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ProcurementERP.Api.Services
{
    public interface IApprovalService
    {
        Task CreateApprovalWorkflowAsync(Guid prId);
        Task<IEnumerable<ApprovalRequest>> GetInboxAsync(Guid userId);
        Task ApproveOrRejectAsync(Guid approvalId, ApprovalStatus status, string? comments);
    }

    public class ApprovalService : IApprovalService
    {
        private readonly ProcurementDbContext _context;

        public ApprovalService(ProcurementDbContext context)
        {
            _context = context;
        }

        public async Task CreateApprovalWorkflowAsync(Guid prId)
        {
            var pr = await _context.PurchaseRequisitions.FindAsync(prId);
            if (pr == null) return;

            var steps = await CalculateApprovalSteps(pr.TotalAmount);

            foreach (var step in steps)
            {
                // Simple implementation: find first user with matching role
                var approver = await _context.Users.FirstOrDefaultAsync(u => u.Role == step.Role);
                if (approver != null)
                {
                    _context.ApprovalRequests.Add(new ApprovalRequest
                    {
                        PurchaseRequisitionId = prId,
                        ApproverId = approver.Id,
                        Step = step.Level,
                        Status = ApprovalStatus.PENDING
                    });
                }
            }
            await _context.SaveChangesAsync();
        }

        private async Task<List<ApprovalStep>> CalculateApprovalSteps(decimal amount)
        {
            var ruleConfig = await _context.RulesConfigs
                .FirstOrDefaultAsync(r => r.Category == "ROUTING" && r.IsActive);

            if (ruleConfig != null)
            {
                var rule = JsonSerializer.Deserialize<ApprovalRule>(ruleConfig.RuleJson);
                var slab = rule?.Slabs.FirstOrDefault(s => amount >= s.Min && amount <= s.Max);
                if (slab != null)
                {
                    return slab.Roles.Select((r, i) => new ApprovalStep { Level = i + 1, Role = r }).ToList();
                }
            }

            // Default Fallback
            return new List<ApprovalStep> { new() { Level = 1, Role = Role.DEPARTMENT_HEAD } };
        }

        public async Task<IEnumerable<ApprovalRequest>> GetInboxAsync(Guid userId)
        {
            return await _context.ApprovalRequests
                .Include(a => a.Approver)
                .Where(a => a.ApproverId == userId && a.Status == ApprovalStatus.PENDING)
                .ToListAsync();
        }

        public async Task ApproveOrRejectAsync(Guid approvalId, ApprovalStatus status, string? comments)
        {
            var approval = await _context.ApprovalRequests.FindAsync(approvalId);
            if (approval == null) return;

            approval.Status = status;
            approval.Comments = comments;
            approval.ApprovedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Check if all steps approved
            var prId = approval.PurchaseRequisitionId;
            var allSteps = await _context.ApprovalRequests.Where(a => a.PurchaseRequisitionId == prId).ToListAsync();

            if (status == ApprovalStatus.REJECTED)
            {
                var pr = await _context.PurchaseRequisitions.FindAsync(prId);
                if (pr != null) pr.Status = PRStatus.REJECTED;
            }
            else if (allSteps.All(a => a.Status == ApprovalStatus.APPROVED))
            {
                var pr = await _context.PurchaseRequisitions.FindAsync(prId);
                if (pr != null) pr.Status = PRStatus.APPROVED;
            }
            await _context.SaveChangesAsync();
        }

        private class ApprovalStep { public int Level { get; set; } public Role Role { get; set; } }
        private class ApprovalRule { public List<Slab> Slabs { get; set; } = new(); }
        private class Slab { public decimal Min { get; set; } public decimal Max { get; set; } public List<Role> Roles { get; set; } = new(); }
    }
}
