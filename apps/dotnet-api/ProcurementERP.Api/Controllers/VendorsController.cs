using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcurementERP.Api.DTOs;
using ProcurementERP.Api.Services;
using ProcurementERP.Core.Entities;

namespace ProcurementERP.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/vendors")]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorService _vendorService;

        public VendorsController(IVendorService vendorService)
        {
            _vendorService = vendorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vendor>>> GetVendors()
        {
            return Ok(await _vendorService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vendor>> GetVendor(Guid id)
        {
            var vendor = await _vendorService.GetByIdAsync(id);
            if (vendor == null) return NotFound();
            return Ok(vendor);
        }

        [HttpPost]
        [Authorize(Roles = "SYSTEM_ADMIN,PROCUREMENT_MANAGER")]
        public async Task<ActionResult<Vendor>> CreateVendor(CreateVendorDto dto)
        {
            var vendor = new Vendor
            {
                Name = dto.Name,
                Category = dto.Category,
                Email = dto.Email,
                CreatedAt = DateTime.UtcNow
            };

            var createdVendor = await _vendorService.CreateAsync(vendor);
            return CreatedAtAction(nameof(GetVendor), new { id = createdVendor.Id }, createdVendor);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SYSTEM_ADMIN")]
        public async Task<IActionResult> DeleteVendor(Guid id)
        {
            await _vendorService.DeleteAsync(id);
            return NoContent();
        }
    }
}
