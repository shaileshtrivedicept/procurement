import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RfqService {
  constructor(private prisma: PrismaService) {}

  async create(prId: string) {
    // Phase 2 Logic: Create RFQ from Approved PR
    return { message: 'RFQ scaffolded logic for Phase 2' };
  }
}
