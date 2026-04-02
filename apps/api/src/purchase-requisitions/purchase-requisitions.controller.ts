import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { PurchaseRequisitionsService } from './purchase-requisitions.service';
import { CreatePRDto } from './dto/purchase-requisition.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('purchase-requisitions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseRequisitionsController {
  constructor(private readonly prService: PurchaseRequisitionsService) {}

  @Post()
  @Roles(Role.REQUESTER, Role.SYSTEM_ADMIN)
  create(@Request() req, @Body() createPRDto: CreatePRDto) {
    return this.prService.create(req.user.id, createPRDto);
  }

  @Get()
  findAll() {
    return this.prService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prService.findOne(id);
  }
}
