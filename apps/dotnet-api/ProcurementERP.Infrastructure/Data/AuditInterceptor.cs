using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ProcurementERP.Core.Entities;
using System.Text.Json;

namespace ProcurementERP.Infrastructure.Data
{
    public class AuditInterceptor : SaveChangesInterceptor
    {
        public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            var context = eventData.Context;
            if (context == null) return result;

            var entries = context.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted)
                .ToList();

            foreach (var entry in entries)
            {
                if (entry.Entity is AuditLog) continue;

                var auditLog = new AuditLog
                {
                    Id = Guid.NewGuid(),
                    EntityType = entry.Entity.GetType().Name,
                    EntityId = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey())?.CurrentValue?.ToString() ?? "N/A",
                    Action = entry.State.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    UserId = Guid.Empty // Note: In a full implementation, use IHttpContextAccessor to get current User ID
                };

                if (entry.State == EntityState.Modified)
                {
                    auditLog.OldValue = JsonSerializer.Serialize(entry.OriginalValues.ToObject());
                    auditLog.NewValue = JsonSerializer.Serialize(entry.CurrentValues.ToObject());
                }

                context.Set<AuditLog>().Add(auditLog);
            }

            return await base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}
