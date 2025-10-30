import { SetMetadata } from '@nestjs/common';
import type { JwtPayload } from '../types/jwt-payload.type';

export const ROLES_KEY = 'roles';
export type Role = JwtPayload['role'];
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
