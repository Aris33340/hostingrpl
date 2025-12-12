import { Controller, Get, Patch, Param, Req } from '@nestjs/common';
import { PresensiService } from './presensi.service';

@Controller('api/presensi')
export class PresensiController {
    constructor(private presensiService: PresensiService) { }
    @Get()
    async getAll() {
        return this.presensiService.getAllPresensi();
    }
    @Get('statistik-data')
    async getCountInfoPresensi() {
        return this.presensiService.getStatistikPresensi();
    }

    @Get('find-peserta/:id')
    async getPesertaByIdPresensi(@Param('id') id: string) {
        return this.presensiService.getPesertaByIdPresensi(Number(id));
    }

    @Get('find-nim/:nim')
    async getPresensiByNim(@Param('nim') nim: string) {
        return this.presensiService.getPresensiByNim(Number(nim));
    }

    @Patch('mark-status/:id')
    async setPresensiHadir(@Param('id') id: string,@Req() req:any) {
        const userId = req.user.sub
        return this.presensiService.setPresensiHadir(Number(id),userId);
    }

    @Patch('unmark-status/:id')
    async setPresensiTidakHadir(@Param('id') id: string) {
        return this.presensiService.setPresensiTidakHadir(Number(id));
    }

    @Patch('mark-status-all')
    async setAllPresensiHadir() {
        return this.presensiService.setAllPresensiHadir();
    }
    @Patch('unMark-status-all')
    async setAllPresensiTidakHadir() {
        return this.presensiService.setAllPresensiTidakHadir();
    }

}
