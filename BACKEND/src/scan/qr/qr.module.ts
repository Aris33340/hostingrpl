import { Module } from '@nestjs/common';
import { QrCodeService } from './qr.service';

@Module({
  providers: [],
  exports: [QrCodeService],
})
export class ScanModule {}
