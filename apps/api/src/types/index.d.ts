import type { JwtPayload } from '../auth/types/jwt-payload.type';

declare module 'express' {
  export interface Request {
    cookies: Record<string, string>;
    user?: JwtPayload;
  }
}
