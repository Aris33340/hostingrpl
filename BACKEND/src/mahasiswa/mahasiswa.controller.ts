import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { Prisma } from 'generated/prisma';
import { CryptoService } from 'src/scan/CryptoService';

@Controller('api/mahasiswa')
export class MahasiswaController {
  constructor(
    private readonly mhsService: MahasiswaService,
    private readonly crypto: CryptoService,
  ) {}

  // 🟩 1️⃣ GET /api/mahasiswa/all
  // Ambil semua data mahasiswa tanpa pagination (versi lama)
  @Get('all')
  async mahasiswas() {
    return this.mhsService.mahasiswas();
  }

  // 🟩 2️⃣ GET /api/mahasiswa?search=&page=&limit=
  // Versi baru dengan fitur pencarian & pagination
  @Get()
  async getMahasiswa(
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.mhsService.getMahasiswaWithPagination(search, +page, +limit);
  }

  // 🟩 3️⃣ POST /api/mahasiswa/bulk
  // Import banyak data mahasiswa dari Excel
  @Post('bulk')
  async createMany(@Body() data: Prisma.mahasiswaCreateManyInput[]) {
    return this.mhsService.createManyMahasiswa(data);
  }

  // 🟩 4️⃣ POST /api/mahasiswa/encrypt
  // Contoh endpoint enkripsi text (pakai CryptoService)
  @Post('encrypt')
  encryptData(@Body('text') text: string) {
    const encrypted = this.crypto.encrypt(text);
    return { encrypted };
  }
}
