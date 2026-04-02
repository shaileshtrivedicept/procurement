import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VendorsModule } from './vendors/vendors.module';
import { PurchaseRequisitionsModule } from './purchase-requisitions/purchase-requisitions.module';
import { ApprovalsModule } from './approvals/approvals.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    VendorsModule,
    PurchaseRequisitionsModule,
    ApprovalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
