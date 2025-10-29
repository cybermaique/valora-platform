export interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
