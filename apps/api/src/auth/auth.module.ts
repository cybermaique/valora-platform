import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../prisma/prisma.module';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import type { StringValue } from 'ms';

function resolveJwtConfig(): {
  secret: string;
  expiresIn: number | StringValue;
} {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error('JWT_SECRET não definido nas variáveis de ambiente.');

  const raw = process.env.JWT_EXPIRES_IN;
  let expiresIn: number | StringValue = '15m';
  if (raw && raw.length > 0) {
    expiresIn = /^\d+$/.test(raw) ? Number(raw) : (raw as StringValue);
  }
  return { secret, expiresIn };
}

const { secret, expiresIn } = resolveJwtConfig();

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret,
      signOptions: { expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PasswordService,
    TokenService,
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    RefreshAuthGuard,
  ],
})
export class AuthModule {}
