using Microsoft.EntityFrameworkCore;
using ProcurementERP.Core.Entities;

namespace ProcurementERP.Infrastructure.Data
{
    public class ProcurementDbContext : DbContext
    {
        public ProcurementDbContext(DbContextOptions<ProcurementDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<Vendor> Vendors => Set<Vendor>();
        public DbSet<PurchaseRequisition> PurchaseRequisitions => Set<PurchaseRequisition>();
        public DbSet<PRItem> PRItems => Set<PRItem>();
        public DbSet<ApprovalRequest> ApprovalRequests => Set<ApprovalRequest>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<RulesConfig> RulesConfigs => Set<RulesConfig>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vendor>().HasIndex(v => v.VendorCode).IsUnique();
            modelBuilder.Entity<PurchaseRequisition>().HasIndex(p => p.PRNumber).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<PRItem>()
                .Property(p => p.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PRItem>()
                .Property(p => p.Quantity).HasPrecision(18, 2);
            modelBuilder.Entity<PRItem>()
                .Property(p => p.TotalPrice).HasPrecision(18, 2);

            modelBuilder.Entity<PurchaseRequisition>()
                .Property(p => p.TotalAmount).HasPrecision(18, 2);
        }
    }
}
