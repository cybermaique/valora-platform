import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './types/jwt-payload.type';

interface AuthenticatedRequest extends Request {
  cookies: {
    refresh_token?: string;
  };
}

function cookieOptions() {
  const secure = String(process.env.COOKIE_SECURE ?? 'false') === 'true';
  const sameSite =
    (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') ?? 'lax';
  const domain = process.env.COOKIE_DOMAIN || undefined;
  return { httpOnly: true, secure, sameSite, domain, path: '/' as const };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.register(dto);
    const opts = cookieOptions();
    const ms =
      Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? '7') *
      24 *
      60 *
      60 *
      1000;
    res.cookie('refresh_token', result.refreshToken, { ...opts, maxAge: ms });
    return { user: result.user, accessToken: result.accessToken };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.login(dto);
    const opts = cookieOptions();
    const ms =
      Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? '7') *
      24 *
      60 *
      60 *
      1000;
    res.cookie('refresh_token', result.refreshToken, { ...opts, maxAge: ms });
    return { user: result.user, accessToken: result.accessToken };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: JwtPayload,
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh = req.cookies?.refresh_token;
    if (!refresh) {
      throw new UnauthorizedException('Refresh token ausente');
    }

    const result = await this.auth.refresh(user.sub, refresh);

    const opts = cookieOptions();
    const ms =
      Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? '7') *
      24 *
      60 *
      60 *
      1000;
    res.cookie('refresh_token', result.refreshToken, { ...opts, maxAge: ms });
    return { user: result.user, accessToken: result.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return { user };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('logout')
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: JwtPayload,
  ) {
    const refresh = req.cookies?.refresh_token;
    if (refresh && user?.sub) {
      await this.auth.logout(user.sub, refresh);
    }
    res.clearCookie('refresh_token', cookieOptions());
    return { ok: true };
  }
}
