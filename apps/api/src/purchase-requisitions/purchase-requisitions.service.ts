import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePRDto } from './dto/purchase-requisition.dto';
import { PRStatus, Priority } from '@prisma/client';

@Injectable()
export class PurchaseRequisitionsService {
  constructor(private prisma: PrismaService) {}

  private async generatePRNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastPR = await this.prisma.purchaseRequisition.findFirst({
      where: { prNumber: { startsWith: `PR-${year}` } },
      orderBy: { createdAt: 'desc' },
    });
    let nextId = 1;
    if (lastPR && lastPR.prNumber) {
      const currentId = parseInt(lastPR.prNumber.split('-')[2]);
      nextId = currentId + 1;
    }
    return `PR-${year}-${nextId.toString().padStart(5, '0')}`;
  }

  async create(userId: string, createPRDto: CreatePRDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user.departmentId) {
      throw new Error('User must belong to a department to create a PR');
    }

    const prNumber = await this.generatePRNumber();
    const totalAmount = createPRDto.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );

    return this.prisma.purchaseRequisition.create({
      data: {
        prNumber,
        description: createPRDto.description,
        priority: createPRDto.priority || Priority.MEDIUM,
        totalAmount,
        status: PRStatus.DRAFT,
        requesterId: userId,
        departmentId: user.departmentId,
        items: {
          create: createPRDto.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findAll() {
    return this.prisma.purchaseRequisition.findMany({
      include: { requester: true, department: true, items: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.purchaseRequisition.findUnique({
      where: { id },
      include: { requester: true, department: true, items: true, approvalRequests: true },
    });
  }

  async updateStatus(id: string, status: PRStatus) {
    return this.prisma.purchaseRequisition.update({
      where: { id },
      data: { status },
    });
  }
}
