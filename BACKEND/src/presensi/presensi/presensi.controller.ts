import { Controller, Get } from '@nestjs/common';
import { PresensiService } from './presensi.service';

@Controller('api/presensi')
export class PresensiController {
    constructor(private presensiService:PresensiService){}
    @Get()
    async getAll(){
        return this.presensiService.getAllPresensi();
    }
}
