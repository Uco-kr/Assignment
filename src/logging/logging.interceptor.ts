import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, originalUrl, query, body } = req;

    const reqLog: Record<string, any> = {
      type: 'REQUEST',
      requestUrl: originalUrl,
      httpMethod: method,
      timestamp: new Date().toISOString(),
    };

    if (method === 'GET' && Object.keys(query).length > 0) {
      reqLog.queryParams = query;
    }

    if (['POST', 'PUT', 'DELETE'].includes(method) && body) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      reqLog.requestBody = body;
    }

    this.logger.log(JSON.stringify(reqLog));

    return next.handle().pipe(
      tap((responseBody: unknown) => {
        const resLog: Record<string, any> = {
          type: 'RESPONSE',
          requestUrl: originalUrl,
          httpMethod: method,
          timestamp: new Date().toISOString(),
          httpStatus: res.statusCode,
        };
        if (responseBody !== undefined && responseBody !== null) {
          resLog.responseBody = responseBody;
        }
        this.logger.log(JSON.stringify(resLog));
      }),
    );
  }
}
