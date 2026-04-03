using System.ComponentModel.DataAnnotations;
using ProcurementERP.Core.Enums;

namespace ProcurementERP.Api.DTOs
{
    public class CreateVendorDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }
    }

    public class CreatePRDto
    {
        [Required]
        public string Description { get; set; } = string.Empty;

        public Priority Priority { get; set; } = Priority.MEDIUM;

        [Required]
        [MinLength(1)]
        public List<CreatePRItemDto> Items { get; set; } = new();
    }

    public class CreatePRItemDto
    {
        [Required]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal Quantity { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal UnitPrice { get; set; }
    }
}
