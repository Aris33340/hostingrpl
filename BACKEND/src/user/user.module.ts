// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan path ini benar!
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [], // Anda bisa menambahkan AuthModule di sini jika Anda menggunakan Guard
  controllers: [UserController],
  providers: [
    UserService, 
    PrismaService,
    AuthService // PrismaService harus disediakan agar UserService dapat menggunakannya
  ], 
  exports: [UserService], // Export UserService jika module lain perlu menggunakannya
})
export class UserModule {}