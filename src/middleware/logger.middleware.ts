import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IRequestUser } from './../interfaces/user.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(request: IRequestUser, response: Response, next: NextFunction) {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode, statusMessage } = response;
      const contentLength = response.get('content-length');
      let username = '';
      if (request.user !== undefined) {
        username =
          url === '*/auth/login*'
            ? request.body.username
            : request.user.username;
      }
      const loggingMessage = `Request {URL:${url}, METHOD:${method}} Response {STATUS_CODE:${statusCode}, STATUS_MESSAGE:${statusMessage}, CONTENT_LENGTH:${contentLength}} Client {USERNAME:${username}, USER_AGENT:${userAgent}, I.P:${ip}}`;
      // Logger.log(loggingMessage, 'Logger Middleware');
      statusCode >= 400 && statusCode <= 599
        ? Logger.error(loggingMessage, null, 'Logger Middleware')
        : Logger.log(loggingMessage, 'Logger Middleware');
    });
    next();
  }
}

export function loggerMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  Logger.log(
    `Request {${request.headers.authorization}, ${request.method}} route`,
    'Logger Middleware',
  );
  next();
}
