import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto/CryptoService';

@Module({
  providers: [ScanService, PrismaService, CryptoService],
  exports: [ScanService],
})
export class ScanModule {}
