using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcurementERP.Api.DTOs;
using ProcurementERP.Api.Services;
using ProcurementERP.Core.Entities;
using System.Security.Claims;

namespace ProcurementERP.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/purchase-requisitions")]
    public class PurchaseRequisitionsController : ControllerBase
    {
        private readonly IPurchaseRequisitionService _prService;

        public PurchaseRequisitionsController(IPurchaseRequisitionService prService)
        {
            _prService = prService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseRequisition>>> GetPRs()
        {
            return Ok(await _prService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseRequisition>> GetPR(Guid id)
        {
            var pr = await _prService.GetByIdAsync(id);
            if (pr == null) return NotFound();
            return Ok(pr);
        }

        [HttpPost]
        public async Task<ActionResult<PurchaseRequisition>> CreatePR(CreatePRDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var pr = new PurchaseRequisition
            {
                Description = dto.Description,
                Priority = dto.Priority,
                RequesterId = userId,
                Items = dto.Items.Select(i => new PRItem
                {
                    Description = i.Description,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };

            var createdPR = await _prService.CreateAsync(pr);
            return CreatedAtAction(nameof(GetPR), new { id = createdPR.Id }, createdPR);
        }

        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitPR(Guid id)
        {
            await _prService.SubmitForApprovalAsync(id);
            return Ok(new { message = "PR submitted for approval" });
        }
    }
}
