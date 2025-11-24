import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // IMPORT ZIP UNDANGAN
  @Post('import-zip')
  @UseInterceptors(FileInterceptor('file'))
  importZip(@UploadedFile() file: Express.Multer.File) {
    return this.emailService.importZip(file);
  }

  @Get('import-history')
  getImportHistory() {
    return this.emailService.getImportHistory();
  }

  // EMAIL TAMU & MAHASISWA
  @Post('send-guest')
  sendToGuest(@Body() body: any) {
    return this.emailService.sendToGuest(body);
  }

  @Post('send-mahasiswa-one')
  sendMahasiswaOne(@Body() body: any) {
    return this.emailService.sendToMahasiswaSingle(body);
  }

  @Post('send-mahasiswa-bulk')
  sendMahasiswaBulk(@Body() body: any) {
    return this.emailService.sendToMahasiswaBulk(body);
  }

  // TAMBAHAN: EMAIL TAMU MASSAL
  @Post('upload-tamu')
  @UseInterceptors(FileInterceptor('file'))
  uploadTamu(@UploadedFile() file: Express.Multer.File) {
    return this.emailService.uploadTamu(file);
  }

  @Post('send-tamu-massal')
  sendTamuMassal(@Body() body: any) {
    return this.emailService.sendTamuMassal(body);
  }

  // RIWAYAT EMAIL (LOG)
  @Get('logs')
  getLogs() {
    return this.emailService.getLogs();
  }

  @Post('retry/:id')
  retry(@Param('id', ParseIntPipe) id: number) {
    return this.emailService.retry(id);
  }

  // MANAJEMEN AKUN EMAIL
  @Post('accounts')
  createAccount(@Body() dto: any) {
    return this.emailService.createAccount(dto);
  }

  @Get('accounts')
  getAccounts() {
    return this.emailService.getAccounts();
  }

  @Patch('accounts/:id/set-active')
  setActiveAccount(@Param('id', ParseIntPipe) id: number) {
    return this.emailService.setActiveAccount(id);
  }

  // QR KEY
  @Post('generate-qr')
  generateQR(@Body() body: any) {
    return this.emailService.generateQrKey(body);
  }

  @Get('qr')
  getQR() {
    return this.emailService.getActiveQrKey();
  }
}
