import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSpendSummary() {
    // Phase 4 Logic: Spend Analytics dashboard
    return { message: 'Spend Analytics for Phase 4' };
  }
}
