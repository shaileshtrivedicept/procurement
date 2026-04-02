import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, ApprovalStatus } from '@prisma/client';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post('submit/:prId')
  @Roles(Role.REQUESTER, Role.SYSTEM_ADMIN)
  submitForApproval(@Param('prId') prId: string) {
    return this.approvalsService.submitForApproval(prId);
  }

  @Get('inbox')
  findInbox(@Request() req) {
    return this.approvalsService.findApprovalsForUser(req.user.id);
  }

  @Post('approve/:id')
  approve(@Param('id') id: string, @Body() body: { status: ApprovalStatus; comments?: string }) {
    return this.approvalsService.approveOrReject(id, body.status, body.comments);
  }
}
