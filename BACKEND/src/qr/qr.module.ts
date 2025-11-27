import { Module } from '@nestjs/common';
import { QrCodeService } from './qr.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QRcontroller } from './qr.controller';
import { CryptoService } from 'src/crypto/crypto/CryptoService';

@Module({
  providers: [QrCodeService,PrismaService,CryptoService],
  exports: [QrCodeService],
  controllers:[QRcontroller]
})
export class QRModule {}
