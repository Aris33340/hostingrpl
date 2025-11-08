import { Module } from '@nestjs/common';
import { PresensiController } from './presensi.controller';
import { PresensiService } from './presensi.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PresensiController],
  providers: [PresensiService, PrismaService]
})
export class PresensiModule {}
