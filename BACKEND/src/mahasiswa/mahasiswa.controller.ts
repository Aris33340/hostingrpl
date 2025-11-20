import { 
  Controller, 
  Get, 
  Query, 
  Post, 
  Body, 
  Put, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  BadRequestException 
} from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { Prisma } from '@prisma/client'
import { CryptoService } from 'src/crypto/crypto/CryptoService';

@Controller('api/mahasiswa')
export class MahasiswaController {
  constructor(
    private readonly mhsService: MahasiswaService,
    private readonly crypto: CryptoService,
  ) {}

  // 🟩 1️⃣ GET /api/mahasiswa/all
  @Get()
  async mahasiswas() {
    return this.mhsService.mahasiswas();
  }

  @Get('by-nim/:nim')
  async getMahasiswaByNim(@Param('nim') nim: string) {
    const nimNumber = Number(nim);
    if (isNaN(nimNumber)) {
      throw new BadRequestException('NIM harus berupa angka');
    }
    return this.mhsService.mahasiswa({ nim: nimNumber });
  }

  // 🟩 2️⃣ GET /api/mahasiswa?search=&page=&limit=
  @Get('pagination')
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
