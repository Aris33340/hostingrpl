import { Body, Controller, Post } from '@nestjs/common';
import { ScanService } from './scan.service';

@Controller('scan')
export class ScanController {
  constructor(private scanService: ScanService) {}
  
  @Post('scanQR')
  async register(@Body() body: { data:string }) {
    return this.scanService.getScanData(body.data);
  }
}