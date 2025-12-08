import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './CryptoService';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CryptoController],
  providers: [CryptoService,PrismaService]
})
export class CryptoModule {}
