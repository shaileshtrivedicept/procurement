using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcurementERP.Api.Services;
using ProcurementERP.Core.Enums;
using System.Security.Claims;

namespace ProcurementERP.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/approvals")]
    public class ApprovalsController : ControllerBase
    {
        private readonly IApprovalService _approvalService;

        public ApprovalsController(IApprovalService approvalService)
        {
            _approvalService = approvalService;
        }

        [HttpGet("inbox")]
        public async Task<ActionResult> GetInbox()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var approvals = await _approvalService.GetInboxAsync(userId);
            return Ok(approvals);
        }

        [HttpPost("{id}/action")]
        public async Task<IActionResult> ActionApproval(Guid id, [FromBody] ApprovalActionDto dto)
        {
            await _approvalService.ApproveOrRejectAsync(id, dto.Status, dto.Comments);
            return Ok(new { message = $"Approval {dto.Status} successful" });
        }

        public class ApprovalActionDto
        {
            public ApprovalStatus Status { get; set; }
            public string? Comments { get; set; }
        }
    }
}
