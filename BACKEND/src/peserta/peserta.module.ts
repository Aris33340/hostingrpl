import { Module } from '@nestjs/common';
import { PesertaService } from './peserta.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PesertaService, PrismaService],
  controllers:[]
})
export class TamuModule {}
