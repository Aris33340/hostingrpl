import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ScanService } from './scan.service';

@Controller('api/scan')
export class ScanController {
  constructor(private scanService: ScanService ) {}
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