import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: '*', // In production, replace with specific domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);

  app.useGlobalGuards(new RolesGuard(reflector));
  app.useGlobalInterceptors(new AuditInterceptor(prisma));

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
