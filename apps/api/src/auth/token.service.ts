import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { Role } from '@prisma/client';
import type { User } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  issueAccessToken(payload: JwtPayload): string {
    return this.jwt.sign(payload);
  }

  async issueRefreshToken(
    userId: string,
    expiresInDays: number,
  ): Promise<{ token: string; expiresAt: Date }> {
    const token = randomBytes(48).toString('hex');
    const tokenHash = sha256(token);
    const expiresAt = addDays(new Date(), expiresInDays);

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return { token, expiresAt };
  }

  /**
   * Valida refresh por (userId, token). Útil quando já possui o id do usuário.
   */
  async validateRefreshToken(
    userId: string,
    token: string,
  ): Promise<User | null> {
    const tokenHash = sha256(token);
    const now = new Date();

    const record = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      include: { user: true },
    });

    return record?.user ?? null;
  }

  /**
   * Valida refresh **apenas pelo token**. Usado na RefreshStrategy baseada em cookie.
   */
  async validateRefreshTokenOnly(token: string): Promise<User | null> {
    const tokenHash = sha256(token);
    const now = new Date();

    const record = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      include: { user: true },
    });

    return record?.user ?? null;
  }

  async rotateRefreshToken(
    userId: string,
    oldToken: string,
    expiresInDays: number,
  ): Promise<{ token: string; expiresAt: Date }> {
    const oldHash = sha256(oldToken);

    await this.prisma.refreshToken.updateMany({
      where: { userId, tokenHash: oldHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return this.issueRefreshToken(userId, expiresInDays);
  }

  async revokeRefreshToken(userId: string, token: string): Promise<void> {
    const tokenHash = sha256(token);
    await this.prisma.refreshToken.updateMany({
      where: { userId, tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
