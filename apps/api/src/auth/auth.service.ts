import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { Role, User } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}
export interface AuthResult {
  user: UserSafe;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

export type UserSafe = Omit<User, 'passwordHash'>;

const REFRESH_DAYS = Number.isFinite(
  Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS),
)
  ? Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS)
  : 7;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
  ) {}

  async register(input: {
    email: string;
    name: string;
    password: string;
  }): Promise<AuthResult> {
    const exists = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (exists) throw new ConflictException('E-mail já cadastrado');

    const passwordHash = await this.passwords.hash(input.password);

    const created = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        role: Role.USER,
      },
    });

    const accessToken = this.tokens.issueAccessToken({
      sub: created.id,
      email: created.email,
      role: created.role,
    });

    const { token: refreshToken, expiresAt } =
      await this.tokens.issueRefreshToken(created.id, REFRESH_DAYS);

    return {
      user: this.toUserSafe(created),
      accessToken,
      refreshToken,
      refreshExpiresAt: expiresAt,
    };
  }

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const ok = await this.passwords.compare(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');

    const accessToken = this.tokens.issueAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { token: refreshToken, expiresAt } =
      await this.tokens.issueRefreshToken(user.id, REFRESH_DAYS);

    return {
      user: this.toUserSafe(user),
      accessToken,
      refreshToken,
      refreshExpiresAt: expiresAt,
    };
  }

  async refresh(userId: string, refreshToken: string): Promise<AuthResult> {
    const user = await this.tokens.validateRefreshToken(userId, refreshToken);
    if (!user) throw new UnauthorizedException('Refresh inválido');

    const accessToken = this.tokens.issueAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { token: newRefresh, expiresAt } =
      await this.tokens.rotateRefreshToken(user.id, refreshToken, REFRESH_DAYS);

    return {
      user: this.toUserSafe(user),
      accessToken,
      refreshToken: newRefresh,
      refreshExpiresAt: expiresAt,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<{ ok: boolean }> {
    await this.tokens.revokeRefreshToken(userId, refreshToken);
    return { ok: true };
  }

  private toUserSafe(u: User): UserSafe {
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }
}
