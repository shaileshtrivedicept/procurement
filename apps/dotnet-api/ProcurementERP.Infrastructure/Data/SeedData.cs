using Microsoft.EntityFrameworkCore;
using ProcurementERP.Core.Entities;
using ProcurementERP.Core.Enums;
using System.Text.Json;

namespace ProcurementERP.Infrastructure.Data
{
    public static class SeedData
    {
        public static async Task Initialize(ProcurementDbContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");

            // Departments
            var itDept = new Department { Id = Guid.NewGuid(), Name = "IT" };
            var financeDept = new Department { Id = Guid.NewGuid(), Name = "Finance" };
            context.Departments.AddRange(itDept, financeDept);

            // Users
            context.Users.AddRange(
                new User { Id = Guid.NewGuid(), Email = "admin@erp.com", PasswordHash = passwordHash, Name = "Admin User", Role = Role.SYSTEM_ADMIN },
                new User { Id = Guid.NewGuid(), Email = "dept_head@erp.com", PasswordHash = passwordHash, Name = "IT Head", Role = Role.DEPARTMENT_HEAD, DepartmentId = itDept.Id },
                new User { Id = Guid.NewGuid(), Email = "proc_mgr@erp.com", PasswordHash = passwordHash, Name = "Procurement Manager", Role = Role.PROCUREMENT_MANAGER }
            );

            // Rules
            var rule = new
            {
                Slabs = new[]
                {
                    new { Min = 0m, Max = 50000m, Roles = new[] { Role.DEPARTMENT_HEAD } },
                    new { Min = 50001m, Max = 500000m, Roles = new[] { Role.DEPARTMENT_HEAD, Role.PROCUREMENT_MANAGER } },
                    new { Min = 500001m, Max = 2500000m, Roles = new[] { Role.DEPARTMENT_HEAD, Role.PROCUREMENT_MANAGER, Role.FINANCE_HEAD } },
                    new { Min = 2500001m, Max = 999999999m, Roles = new[] { Role.DEPARTMENT_HEAD, Role.PROCUREMENT_MANAGER, Role.FINANCE_HEAD, Role.MANAGING_DIRECTOR } }
                }
            };

            context.RulesConfigs.Add(new RulesConfig
            {
                Id = Guid.NewGuid(),
                Category = "ROUTING",
                Name = "Approval Routing Rule",
                RuleJson = JsonSerializer.Serialize(rule),
                IsActive = true
            });

            await context.SaveChangesAsync();
        }
    }
}
