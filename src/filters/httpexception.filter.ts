import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      'status code': status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message || null
          : 'Internal server error',
    };

    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    //   Logger.error(
    //     `Request {${request.url}, ${request.method}} route`,
    //     exception.stack,
    //     'Exception Filter',
    //   );
    // } else {
    //   Logger.error(
    //     `Request {${request.url}, ${request.method}} route`,
    //     JSON.stringify(errorResponse),
    //     'Exception Filter',
    //   );
    // }

    response.status(status).json(errorResponse);
  }
}
