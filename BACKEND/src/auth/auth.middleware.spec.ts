import { PrismaService } from 'src/prisma/prisma.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(AuthMiddleware).toBeDefined();
  });
});
