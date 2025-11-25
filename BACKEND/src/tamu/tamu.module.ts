import { Module } from '@nestjs/common';
import { TamuService } from './tamu.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TamuService, PrismaService],
  exports: [TamuService],
})
export class TamuModule {}
