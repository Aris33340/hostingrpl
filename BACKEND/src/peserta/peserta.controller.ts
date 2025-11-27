import { Controller, Get, Param, Query, Body, NotFoundException, } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PesertaService } from "./peserta.service";
import { Prisma } from "@prisma/client";

@Controller('api/peserta')
export class PesertaController {
    constructor(private pesertaService: PesertaService, private prisma: PrismaService) { }

    @Get('getField')
    async getFields(@Query('table') table: string) {
        const fields = await this.pesertaService.getFields(table);
        return fields
    }
    @Get('getField/sample')
    async getFieldSample(@Query('table') table: string, @Body('select') select: Prisma.mahasiswaSelect | Prisma.tamuSelect, @Query('lengthType') lengthType: string) {
        try {
            return await this.pesertaService.getFieldLength(table, select, lengthType);
        } catch (error) {
            return new NotFoundException('tidak ditemukan');
        }
    }
}