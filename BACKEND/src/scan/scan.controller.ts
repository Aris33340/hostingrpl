import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ScanService } from './scan.service';

@Controller('api/scan')
export class ScanController {
  constructor(private scanService: ScanService) {}
  
  @Post()
  async scanQr(@Body('qr') qr: string) {
    const data = await this.scanService.getScanData(qr);
    return { success: true, data };
  }
  @Patch(':id')
  async updateStatusPresensi(@Param('id') id :Number,@Body('status') status:Number){
    const data = await this.scanService.updateStatusPresensi(id,status);
    return { success: true, data };
  }
}