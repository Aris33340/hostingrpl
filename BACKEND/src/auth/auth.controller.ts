import { Body, Controller, Post, Res, Req, UnauthorizedException,  BadRequestException} from '@nestjs/common';
import { AuthService } from './auth.service';
// PERBAIKAN: 'import' diubah menjadi 'import type'
import type { Response, Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // Endpoint 'register' tidak berubah, sudah benar.
  @Post('register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    return this.authService.register(body.username, body.email, body.password);
  }

  // Pastikan import BadRequestException ada di paling atas file:
  // import { Body, Controller, Post, Res, BadRequestException } from '@nestjs/common';

  @Post('login')
  async login(
    @Body() body: any, // Gunakan 'any' agar fleksibel menerima format data
    @Res({ passthrough: true }) res: Response
  ) {
    // PERBAIKAN UTAMA:
    // Ambil 'username'. Jika kosong, coba cek apakah ada 'email'.
    // Ini mencegah error "undefined" jika Frontend masih mengirim key 'email'.
    const usernameInput = body.username || body.email;

    // Validasi sederhana sebelum ke database
    if (!usernameInput) {
       throw new BadRequestException('Username wajib diisi! Data yang diterima kosong.');
    }

    // Panggil service dengan variabel yang sudah pasti terisi
    const loginData = await this.authService.login(usernameInput, body.password);

    res.cookie('refresh_token', loginData.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: loginData.access_token,
      role: loginData.role,
      id : loginData.id
    };
  }

  // --- ENDPOINT BARU 'refresh' ---
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const oldRefreshToken = req.cookies['refresh_token'];
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    

    let payload: any;
    try {
      payload = await this.authService.validateRefreshToken(oldRefreshToken);
    } catch (e) {
      res.clearCookie('refresh_token', { httpOnly: true, path: '/' });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.authService.getTokens(
      payload.sub,
      payload.email,
      payload.role
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite:"lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: tokens.access_token,
    };
  }

  // --- Endpoint 'logout' DIPERBAIKI ---
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}