import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthMiddleware } from './auth/auth.middleware';

import { TamuModule } from './tamu/tamu.module';
import { TamuService } from './tamu/tamu.service';

import { ScanModule } from './scan/scan.module';
import { ScanController } from './scan/scan.controller';

import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { MahasiswaController } from './mahasiswa/mahasiswa.controller';

import { CryptoService } from './crypto/crypto/CryptoService';
import { CryptoModule } from './crypto/crypto/crypto.module';

import { FileModule } from './file/file.module';
import { PresensiModule } from './presensi/presensi/presensi.module';
import { EditorModule } from './editor/editor.module';
import { QrCodeService } from './scan/qr/qr.service';
import { EmailModule } from './email/email.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TamuModule,
    ScanModule,
    MahasiswaModule,
    FileModule,
    CryptoModule,
    PresensiModule,
    EditorModule,
    EmailModule,
    TemplateModule,
  ],
  controllers: [AuthController, AppController, ScanController, MahasiswaController],
  providers: [AppService, PrismaService, CryptoService, TamuService, QrCodeService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
