import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ScanService } from './scan.service';
import type QRDTO from './qr/dto/qroptions.dto';
import { QrCodeService } from './qr/qr.service';

@Controller('api/scan')
export class ScanController {
  constructor(private scanService: ScanService, private qrCodeService: QrCodeService ) {}
  @Post('create-qr')
  async qreateQr(@Body()qrDto:QRDTO) {
    this.qrCodeService.createQR(qrDto,'test','qr-sample');
    return {success:'success'}
  }


  @Post()
  async scanQr(@Body('data') data: string) {
    const hasilDecrypt = await this.scanService.ScanData(data);
    return { success: true, hasilDecrypt };
  }
  @Patch(':id')
  async updateStatusPresensi(@Param('id') id :Number,@Body('status') status:Number){
    const data = await this.scanService.updateStatusPresensi(id,status);
    return { success: true, data };
  }
}