import 'express';
import { JwtPayload } from '../../types/jwt';

declare module 'express' {
  export interface Request {
 user?: JwtPayload;
  }
}
