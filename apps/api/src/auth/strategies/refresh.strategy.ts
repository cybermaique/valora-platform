import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import type { Strategy as PassportStrategyBase } from 'passport';
import type { Request } from 'express-serve-static-core';

import { TokenService } from '../token.service';
import type { JwtPayload } from '../types/jwt-payload.type';

type StrategyConstructor = new (...args: never[]) => PassportStrategyBase;

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  CustomStrategy as unknown as StrategyConstructor,
  'refresh',
) {
  constructor(private readonly tokens: TokenService) {
    super();
  }

  async validate(req: Request): Promise<JwtPayload> {
    const cookies = req.cookies as Record<string, string> | undefined;
    const refresh = cookies?.['refresh_token'];
    if (!refresh) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    const user = await this.tokens.validateRefreshTokenOnly(refresh);
    if (!user) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
