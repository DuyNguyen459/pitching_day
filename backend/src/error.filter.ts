import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();

      if (typeof resContent === 'object' && resContent !== null) {
        const anyRes = resContent as Record<string, unknown>;
        if (Array.isArray(anyRes.message)) {
          message = anyRes.message.join(', ');
        } else if (typeof anyRes.message === 'string') {
          message = anyRes.message;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }

      // Map HTTP Status to Custom Error Codes
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          errorCode = 'VALIDATION_ERROR';
          break;
        case HttpStatus.UNAUTHORIZED:
          errorCode = 'AUTH_REQUIRED';
          break;
        case HttpStatus.FORBIDDEN:
          errorCode = 'PERMISSION_DENIED';
          break;
        case HttpStatus.NOT_FOUND:
          errorCode = 'RESOURCE_NOT_FOUND';
          break;
        default:
          errorCode = 'INTERNAL_SERVER_ERROR';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      error: errorCode,
      message,
    });
  }
}
