import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, PRStatus, ApprovalStatus, Priority } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async submitForApproval(prId: string) {
    const pr = await this.prisma.purchaseRequisition.findUnique({
      where: { id: prId },
      include: { requester: true, items: true },
    });

    if (!pr || pr.status !== PRStatus.DRAFT) {
      throw new Error('PR not found or not in draft status');
    }

    const approvalSteps = await this.calculateApprovalSteps(pr.totalAmount.toNumber(), pr.priority);

    // Update PR status to pending
    await this.prisma.purchaseRequisition.update({
      where: { id: prId },
      data: { status: PRStatus.PENDING_APPROVAL },
    });

    // Create approval requests for each step
    for (const step of approvalSteps) {
      const usersWithRole = await this.prisma.user.findMany({
        where: { role: step.role },
      });

      if (usersWithRole.length > 0) {
        await this.prisma.approvalRequest.create({
          data: {
            step: step.level,
            approverId: usersWithRole[0].id,
            purchaseRequisitionId: prId,
            status: ApprovalStatus.PENDING,
          },
        });
      }
    }

    return { message: 'PR submitted for approval successfully' };
  }

  private async calculateApprovalSteps(amount: number, priority: Priority) {
    const routingRule = await this.prisma.rulesConfig.findFirst({
      where: { category: 'ROUTING', name: 'Approval Routing Rule', isActive: true },
    });

    if (!routingRule) {
      // Fallback to basic department head approval if no rule exists
      return [{ level: 1, role: Role.DEPARTMENT_HEAD }];
    }

    const ruleData = routingRule.rule as any;
    const slabs = ruleData.slabs || [];

    // Find the slab that fits the amount
    const matchingSlab = slabs.find((slab: any) =>
      amount >= (slab.min || 0) && amount <= (slab.max || Infinity)
    );

    if (matchingSlab) {
      return matchingSlab.roles.map((role: Role, index: number) => ({
        level: index + 1,
        role,
      }));
    }

    return [{ level: 1, role: Role.DEPARTMENT_HEAD }];
  }

  async findApprovalsForUser(userId: string) {
    return this.prisma.approvalRequest.findMany({
      where: { approverId: userId, status: ApprovalStatus.PENDING },
      include: { purchaseRequisition: { include: { requester: true, items: true } } },
    });
  }

  async approveOrReject(approvalId: string, status: ApprovalStatus, comments?: string) {
    const approval = await this.prisma.approvalRequest.update({
      where: { id: approvalId },
      data: { status, comments, approvedAt: new Date() },
    });

    const prId = approval.purchaseRequisitionId;
    const allApprovals = await this.prisma.approvalRequest.findMany({
      where: { purchaseRequisitionId: prId },
    });

    if (status === ApprovalStatus.REJECTED) {
      await this.prisma.purchaseRequisition.update({
        where: { id: prId },
        data: { status: PRStatus.REJECTED },
      });
    } else if (allApprovals.every((a) => a.status === ApprovalStatus.APPROVED)) {
      await this.prisma.purchaseRequisition.update({
        where: { id: prId },
        data: { status: PRStatus.APPROVED },
      });
    }

    return approval;
  }
}
