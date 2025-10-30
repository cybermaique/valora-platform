import type { JwtPayload } from '../auth/types/jwt-payload.type';
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    cookies?: Record<string, string | undefined>;
    user?: JwtPayload;
  }
}
