namespace ProcurementERP.Core.Enums
{
    public enum Role
    {
        REQUESTER,
        DEPARTMENT_HEAD,
        PROCUREMENT_MANAGER,
        FINANCE_HEAD,
        MANAGING_DIRECTOR,
        PROCUREMENT_OFFICER,
        ACCOUNTS_PAYABLE,
        WAREHOUSE_USER,
        INTERNAL_AUDITOR,
        SYSTEM_ADMIN,
        VENDOR_USER
    }

    public enum PRStatus
    {
        DRAFT,
        PENDING_APPROVAL,
        APPROVED,
        REJECTED,
        CANCELLED
    }

    public enum ApprovalStatus
    {
        PENDING,
        APPROVED,
        REJECTED
    }

    public enum Priority
    {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
