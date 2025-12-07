import { Module } from '@nestjs/common';
import { PesertaService } from './peserta.service';
import { PrismaService } from '../prisma/prisma.service';
import { PesertaController } from './peserta.controller';

@Module({
  providers: [PesertaService, PrismaService],
  controllers:[PesertaController]
})
export class PesertaModule {}
