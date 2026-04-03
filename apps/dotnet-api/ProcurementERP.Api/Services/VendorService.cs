using ProcurementERP.Core.Entities;
using ProcurementERP.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ProcurementERP.Api.Services
{
    public interface IVendorService
    {
        Task<IEnumerable<Vendor>> GetAllAsync();
        Task<Vendor?> GetByIdAsync(Guid id);
        Task<Vendor> CreateAsync(Vendor vendor);
        Task UpdateAsync(Vendor vendor);
        Task DeleteAsync(Guid id);
    }

    public class VendorService : IVendorService
    {
        private readonly ProcurementDbContext _context;

        public VendorService(ProcurementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vendor>> GetAllAsync()
        {
            return await _context.Vendors.ToListAsync();
        }

        public async Task<Vendor?> GetByIdAsync(Guid id)
        {
            return await _context.Vendors.FindAsync(id);
        }

        public async Task<Vendor> CreateAsync(Vendor vendor)
        {
            vendor.VendorCode = await GenerateVendorCode();
            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();
            return vendor;
        }

        public async Task UpdateAsync(Vendor vendor)
        {
            _context.Entry(vendor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var vendor = await _context.Vendors.FindAsync(id);
            if (vendor != null)
            {
                _context.Vendors.Remove(vendor);
                await _context.SaveChangesAsync();
            }
        }

        private async Task<string> GenerateVendorCode()
        {
            var lastVendor = await _context.Vendors
                .OrderByDescending(v => v.CreatedAt)
                .FirstOrDefaultAsync();

            int nextId = 1;
            if (lastVendor != null && lastVendor.VendorCode.StartsWith("VND-"))
            {
                if (int.TryParse(lastVendor.VendorCode.AsSpan(4), out int lastId))
                {
                    nextId = lastId + 1;
                }
            }

            return $"VND-{nextId:D5}";
        }
    }
}
