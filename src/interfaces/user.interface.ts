import { Request } from 'express';

export interface IRequestUser extends Request {
  user: any;
}
