import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditorController } from './editor.controller';
import { EditorService } from './editor.service';
import { MahasiswaService } from 'src/mahasiswa/mahasiswa.service';

@Module({
  controllers: [EditorController],
  providers: [EditorService, PrismaService, MahasiswaService]
})
export class EditorModule {}
