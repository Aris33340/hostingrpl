import { Module } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from 'src/scan/CryptoService';

@Module({
  providers: [MahasiswaService, PrismaService, CryptoService],
  exports: [MahasiswaService],
})
export class MahasiswaModule {}