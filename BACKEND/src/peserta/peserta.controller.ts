import { Controller, Get, Post, Query, Body, NotFoundException, } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PesertaService } from "./peserta.service";
import { Prisma } from "@prisma/client";

@Controller('api/peserta')
export class PesertaController {
    constructor(private pesertaService: PesertaService, private prisma: PrismaService) { }

    @Get('fields')
    async getFields(@Query('table') table: string) {
        const fields = await this.pesertaService.getFields(table);
        return fields
    }

    @Post('field/sample/max')
    async getMaxFieldSample(@Query('table') table: string, @Body('select') select: Prisma.mahasiswaSelect | Prisma.tamuSelect) {
        try {
            return await this.pesertaService.getFieldLength(table, select, 'max');
        } catch (error) {
            return new NotFoundException("Tidak Ditemukan");
        }
    }

    @Post('field/sample/min')
    async getMinFieldSample(@Query('table') table: string, @Body('select') select: Prisma.mahasiswaSelect | Prisma.tamuSelect) {
        try {
            return await this.pesertaService.getFieldLength(table, select, 'min');
        } catch (error) {
            return new NotFoundException("Tidak Ditemukan");
        }
    }

    @Post('field/sample/avg')
    async getAvgFieldSample(@Query('table') table: string, @Body('select') select: Prisma.mahasiswaSelect | Prisma.tamuSelect) {
        try {
            return await this.pesertaService.getFieldLength(table, select, 'average');
        } catch (error) {
            return new NotFoundException("Tidak Ditemukan");
        }
    }
}