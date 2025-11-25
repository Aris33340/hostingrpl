import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaService } from 'src/prisma/prisma.service';
<<<<<<< HEAD
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService, AuthService]
=======

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService]
>>>>>>> origin/tya
})
export class FileModule {}
