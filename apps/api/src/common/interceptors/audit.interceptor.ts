import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body } = request;

    return next.handle().pipe(
      tap(async (data) => {
        if (['POST', 'PATCH', 'DELETE'].includes(method) && user) {
          // Identify entity and action
          const entityType = url.split('/')[1];
          const entityId = data?.id || body?.id || 'N/A';
          const action = `${method} ${url}`;

          await this.prisma.auditLog.create({
            data: {
              entityType,
              entityId,
              action,
              newValue: body,
              userId: user.id,
              ipAddress: request.ip,
            },
          });
        }
      }),
    );
  }
}
