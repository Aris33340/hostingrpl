import { Module } from '@nestjs/common';
import { TamuService } from './tamu.service';
import { PrismaService } from '../prisma/prisma.service';
import { TamuController } from './tamu.controller';

@Module({
  controllers: [TamuController],
  providers: [TamuService, PrismaService],
  exports: [TamuService],
})
export class TamuModule {}
