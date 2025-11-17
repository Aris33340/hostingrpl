import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto/CryptoService';
import { QrCodeService } from './qr/qr.service';

@Module({
  providers: [ScanService, PrismaService, CryptoService, QrCodeService],
  exports: [ScanService, QrCodeService],
})
export class ScanModule {}
