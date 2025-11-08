<<<<<<< HEAD
import { Controller, Get, Query, Post, Body, Put, Param, Delete, ParseIntPipe, BadRequestException } from '@nestjs/common';
=======
import { Body, Controller, Post,Patch,Param, Get } from '@nestjs/common';
>>>>>>> 04d66ca9d62cc7ba453975989625e81bf4978a86
import { MahasiswaService } from './mahasiswa.service';
import { Prisma } from 'generated/prisma';
import { CryptoService } from 'src/crypto/crypto/CryptoService';

@Controller('api/mahasiswa')
export class MahasiswaController {
  constructor(
    private readonly mhsService: MahasiswaService,
    private readonly crypto: CryptoService,
  ) {}

  // 🟩 1️⃣ GET /api/mahasiswa/all
  @Get('all')
  async mahasiswas() {
    return this.mhsService.mahasiswas();
  }

  // 🟩 2️⃣ GET /api/mahasiswa?search=&page=&limit=
  @Get()
  async getMahasiswa(
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.mhsService.getMahasiswaWithPagination(search, +page, +limit);
  }

  // 🟩 3️⃣ POST /api/mahasiswa/bulk
  @Post('bulk')
  async createMany(@Body() data: Prisma.mahasiswaCreateManyInput[]) {
    return this.mhsService.createManyMahasiswa(data);
  }

  // 🟩 4️⃣ POST /api/mahasiswa/encrypt
  @Post('encrypt')
  encryptData(@Body('text') text: string) {
    const encrypted = this.crypto.encrypt(text);
    return { encrypted };
  }

  // 🟩 5️⃣ POST /api/mahasiswa
  @Post()
  async createMahasiswa(@Body() body: any) {
    try {
      const data: Prisma.mahasiswaCreateInput = {
        nim: parseInt(body.nim),
        nama: body.nama,
        kelas: body.kelas || '',
        prodi: body.prodi || null,
        no_telp: body.no_telp || null,
        nama_orang_tua: body.nama_orang_tua || null,
        judul_skripsi: body.judul_skripsi || null,
        dosen_pembimbing: body.dosen_pembimbing || null,
        daerah_asal: body.daerah_asal || null,
        daerah_penempatan: body.daerah_penempatan || null,
      };

      if (isNaN(data.nim)) {
        throw new BadRequestException('NIM harus berupa angka');
      }

      return this.mhsService.createMahasiswa(data);
    } catch (error) {
      throw new BadRequestException(error.message || 'Gagal menambah mahasiswa');
    }
  }

  // 🟩 6️⃣ PUT /api/mahasiswa/:nim
  @Put(':nim')
  async updateMahasiswa(
    @Param('nim', ParseIntPipe) nim: number,
    @Body() body: any,
  ) {
    try {
      const data: Prisma.mahasiswaUpdateInput = {
        nama: body.nama,
        kelas: body.kelas,
        prodi: body.prodi || null,
        no_telp: body.no_telp || null,
        nama_orang_tua: body.nama_orang_tua || null,
        judul_skripsi: body.judul_skripsi || null,
        dosen_pembimbing: body.dosen_pembimbing || null,
        daerah_asal: body.daerah_asal || null,
        daerah_penempatan: body.daerah_penempatan || null,
      };

      return this.mhsService.updateMahasiswa({ where: { nim }, data });
    } catch (error) {
      throw new BadRequestException(error.message || 'Gagal mengupdate mahasiswa');
    }
  }

  // 🟩 7️⃣ DELETE /api/mahasiswa/:nim
  @Delete(':nim')
  async deleteMahasiswa(@Param('nim', ParseIntPipe) nim: number) {
    try {
      return this.mhsService.deleteMahasiswa({ nim });
    } catch (error) {
      throw new BadRequestException(error.message || 'Gagal menghapus mahasiswa');
    }
  }
}