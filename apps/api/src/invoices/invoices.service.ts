import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async matchThreeWay(grnId: string, invoiceAmount: number) {
    // Phase 3 Logic: 3-way match (PO vs GRN vs Invoice)
    return { message: '3-Way Match logic for Phase 3' };
  }
}
