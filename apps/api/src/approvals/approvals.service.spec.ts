import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalsService } from './approvals.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Priority } from '@prisma/client';

describe('ApprovalsService', () => {
  let service: ApprovalsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalsService,
        {
          provide: PrismaService,
          useValue: {
            rulesConfig: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ApprovalsService>(ApprovalsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate approval steps based on database rules', async () => {
    const mockRule = {
      rule: {
        slabs: [
          { min: 0, max: 50000, roles: [Role.DEPARTMENT_HEAD] },
          { min: 50001, max: 500000, roles: [Role.DEPARTMENT_HEAD, Role.PROCUREMENT_MANAGER] },
        ],
      },
    };

    (prisma.rulesConfig.findFirst as jest.Mock).mockResolvedValue(mockRule);

    const stepsLow = await (service as any).calculateApprovalSteps(10000, Priority.LOW);
    expect(stepsLow).toHaveLength(1);
    expect(stepsLow[0].role).toBe(Role.DEPARTMENT_HEAD);

    const stepsMid = await (service as any).calculateApprovalSteps(100000, Priority.MEDIUM);
    expect(stepsMid).toHaveLength(2);
    expect(stepsMid[1].role).toBe(Role.PROCUREMENT_MANAGER);
  });

  it('should fallback to default if no rule found', async () => {
    (prisma.rulesConfig.findFirst as jest.Mock).mockResolvedValue(null);

    const steps = await (service as any).calculateApprovalSteps(10000, Priority.LOW);
    expect(steps).toHaveLength(1);
    expect(steps[0].role).toBe(Role.DEPARTMENT_HEAD);
  });
});
