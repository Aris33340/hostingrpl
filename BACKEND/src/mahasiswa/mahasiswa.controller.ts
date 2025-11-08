import { Body, Controller, Post,Patch,Param, Get } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { Prisma } from 'generated/prisma';
import { CryptoService } from 'src/crypto/crypto/CryptoService';

@Controller('api/mahasiswa')
export class MahasiswaController {
  constructor(private mhsService: MahasiswaService, private crypto: CryptoService) { }

  @Get()
  async mahasiswas() {
    return this.mhsService.mahasiswas();
  }
  @Post('bulk')
  async createMany(@Body() data: Prisma.mahasiswaCreateManyInput[]) {
    return this.mhsService.createManyMahasiswa(data);
  }
  @Post('encrypt')
  encryptData(@Body('text') text: string) {
    const encrypted = this.crypto.encrypt(text);
    return { encrypted };
  }
}