import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { TamuService } from './tamu.service';
import { Prisma } from '@prisma/client';

@Controller('api/tamu')
export class TamuController {
  constructor(private readonly tamuService: TamuService) { }

  // 🟦 Ambil list instansi unik (untuk filter)
  @Get('field/instansi')
  async getAllInstansi() {
    return this.tamuService.getAllInstansi();
  }

  // 🟩 1️⃣ GET /api/tamu  → semua tamu
  @Get()
  async getAllTamu() {
    return this.tamuService.tamus({});
  }

  // 🟩 2️⃣ GET /api/tamu/by-id/:id  → ambil tamu berdasarkan id
  @Get('by-id/:id')
  async getTamuById(@Param('id') id: string) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('ID tamu harus berupa angka');
    }
    return this.tamuService.tamu({ id_tamu: idNumber });
  }

  // 🟩 3️⃣ GET /api/tamu/pagination?search=&page=&limit=&instansi=
  @Get('pagination')
  async getTamuPagination(
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('instansi') instansi?: string,
    @Query('presensiStatus') presensiStatus?:number
  ) {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (isNaN(pageNum) || isNaN(limitNum)) {
      throw new BadRequestException('Page dan limit harus berupa angka');
    }
    try {
      presensiStatus = presensiStatus !== undefined ? Number(presensiStatus) : undefined;
      return this.tamuService.getTamuWithPagination(
        search ?? '',
        pageNum,
        limitNum,
        instansi,
        presensiStatus  // ⬅ kirim ke service
      );
    } catch (e) {
      console.log(e)
    }
  }


  // 🟩 4️⃣ POST /api/tamu → tambah satu tamu
  @Post()
  async createTamu(@Body() body: any) {
    try {
      const data: Prisma.tamuCreateInput = {
        nama: body.nama,
        email: body.email || null,
        asal_instansi: body.asal_instansi || null,
      };

      return this.tamuService.createTamu(data);
    } catch (error) {
      throw new BadRequestException(error.message || 'Gagal menambah tamu');
    }
  }

  // 🟩 5️⃣ PUT /api/tamu/:id → update tamu
  @Put(':id')
  async updateTamu(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    try {
      const data: Prisma.tamuUpdateInput = {
        nama: body.nama,
        email: body.email || null,
        asal_instansi: body.asal_instansi || null,
      };

      return this.tamuService.updateTamu({ where: { id_tamu: id }, data });
    } catch (error) {
      throw new BadRequestException(error.message || 'Gagal mengupdate tamu');
    }
  }

  // 🟩 6️⃣ DELETE /api/tamu/:id → hapus tamu
  @Delete(':id')
  async deleteTamu(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.tamuService.deleteTamu({ id_tamu: id });
    } catch (error) {
      throw new BadRequestException(error.message || 'Gagal menghapus tamu');
    }
  }
  // 🟩 7️⃣ POST /api/tamu/bulk  → upload banyak tamu dari Excel
  @Post('bulk')
  async bulkCreate(@Body() body: any[],@Req() req:any) {
    try {
      const userId = req.user.sub;
      return this.tamuService.bulkCreate(body,userId);
    } catch (error) {
      throw new BadRequestException(error.message || 'Gagal upload data tamu');
    }
  }
}
