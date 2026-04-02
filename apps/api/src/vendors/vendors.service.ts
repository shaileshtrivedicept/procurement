import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  private async generateVendorCode(): Promise<string> {
    const lastVendor = await this.prisma.vendor.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    let nextId = 1;
    if (lastVendor && lastVendor.vendorCode) {
      const currentId = parseInt(lastVendor.vendorCode.split('-')[1]);
      nextId = currentId + 1;
    }
    return `VND-${nextId.toString().padStart(5, '0')}`;
  }

  async create(createVendorDto: CreateVendorDto) {
    const vendorCode = await this.generateVendorCode();
    return this.prisma.vendor.create({
      data: {
        ...createVendorDto,
        vendorCode,
      },
    });
  }

  async findAll() {
    return this.prisma.vendor.findMany();
  }

  async findOne(id: string) {
    return this.prisma.vendor.findUnique({ where: { id } });
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: { id },
      data: updateVendorDto,
    });
  }

  async remove(id: string) {
    return this.prisma.vendor.delete({ where: { id } });
  }
}
