import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs'; // Menggunakan import standar
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { $Enums as Role } from 'generated/prisma/client';
import { userRole } from '@prisma/client';

@Injectable()
export class AuthService {

  // --- PERUBAHAN ---
  // Kita sekarang mengambil DUA secret key dari .env
  // (yang baru saja Anda tambahkan di langkah 1.1)
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly registerToken: string;


  constructor(private prisma: PrismaService, private configService: ConfigService) {
    // Ambil secret baru. getOrThrow akan error jika .env tidak diatur.
    this.accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.registerToken = this.configService.getOrThrow<string>('REGISTER_TOKEN');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // --- FUNGSI LAMA 'generateToken' DIHAPUS ---
  // dan diganti dengan 'getTokens'

  // --- FUNGSI BARU ---
  // Fungsi ini membuat access token (15m) dan refresh token (7d)
  async getTokens(userId: number, email: string, role: string) {
    const payload = {
      sub: userId,
      email: email,
      role: role
    };

    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: '15s', // 15 menit
    });

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: '1W', // 7 hari
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(username: string, email: string, password: string, token:string ,role?: userRole): Promise<string> {
    const hashedPassword = await this.hashPassword(password);

    if (!token || token !== this.registerToken) {
      throw new UnauthorizedException('Some Parameters Not Found');
    }
    // Cek jika user sudah ada
    const emailExist = await this.prisma.user.findUnique({ where: { email } });
    const usernameExist = await this.prisma.user.findUnique({ where: { username } });
    if (usernameExist) {
      throw new UnauthorizedException('username already in use');
    }
    if (emailExist) {
      throw new UnauthorizedException('email already in use');
    }

    const user = await this.prisma.user.create({
      data: {
        username,
        email: email,
        password: hashedPassword,
        role: role ?? 'PETUGAS', // Anda bisa ubah default role ini
      },
    });

    // Kita tidak auto-login setelah register
    // const token = await this.generateToken(user.id_user); // <-- DIHAPUS

    return "Register Berhasil Silakan Login";
  }

  // --- FUNGSI 'login' DIMODIFIKASI ---
  // Sekarang me-return DUA token + role
  async login(email: string, password: string): Promise<{ access_token: string, refresh_token: string, role: string, id: number }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Panggil fungsi baru kita
    const tokens = await this.getTokens(user.id_user, user.email, user.role);
    // Return semua yang dibutuhkan controller
    return {
      ...tokens,
      role: user.role,
      id: user.id_user
    };
  }

  // --- FUNGSI 'validateToken' DIMODIFIKASI ---
  // Sekarang secara spesifik memvalidasi ACCESS token
  async validateToken(token: string): Promise<any> {
    try {
      // Validasi menggunakan ACCESS secret
      return jwt.verify(token, this.accessSecret);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // --- FUNGSI BARU (Optional tapi direkomendasikan) ---
  // Fungsi ini akan kita gunakan untuk memvalidasi refresh token
  async validateRefreshToken(token: string): Promise<any> {
    try {
      // Validasi menggunakan REFRESH secret
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}