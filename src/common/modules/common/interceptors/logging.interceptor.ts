import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { CustomLoggerService } from '../services/logger';
import { CustomResponse } from '@common/classes/custom-response.class';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler<CustomResponse>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const persona = request;

    return next.handle().pipe(
      tap<CustomResponse>((res) => {
        if (request.method === 'GET' || request.method === 'HEAD') return;

        const logMessage = this.logger.generateLogMessage(request, res.statusCode);

        this.logger.log(logMessage);
      }),
    );
  }
}
