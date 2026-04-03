using System;
using System.Collections.Generic;
using ProcurementERP.Core.Enums;

namespace ProcurementERP.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public Role Role { get; set; }
        public Guid? DepartmentId { get; set; }
        public Department? Department { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Department
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<User> Users { get; set; } = new();
    }

    public class Vendor
    {
        public Guid Id { get; set; }
        public string VendorCode { get; set; } = string.Empty; // VND-XXXXX
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Status { get; set; } = "ACTIVE";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class PurchaseRequisition
    {
        public Guid Id { get; set; }
        public string PRNumber { get; set; } = string.Empty; // PR-YYYY-XXXXX
        public string Description { get; set; } = string.Empty;
        public PRStatus Status { get; set; } = PRStatus.DRAFT;
        public Priority Priority { get; set; } = Priority.MEDIUM;
        public decimal TotalAmount { get; set; }
        public Guid RequesterId { get; set; }
        public User? Requester { get; set; }
        public Guid DepartmentId { get; set; }
        public Department? Department { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<PRItem> Items { get; set; } = new();
    }

    public class PRItem
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public Guid PurchaseRequisitionId { get; set; }
    }

    public class ApprovalRequest
    {
        public Guid Id { get; set; }
        public int Step { get; set; }
        public ApprovalStatus Status { get; set; } = ApprovalStatus.PENDING;
        public Guid ApproverId { get; set; }
        public User? Approver { get; set; }
        public Guid PurchaseRequisitionId { get; set; }
        public string? Comments { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AuditLog
    {
        public Guid Id { get; set; }
        public string EntityType { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class RulesConfig
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string RuleJson { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
