import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { TamuService } from './tamu/tamu.service';
import { PrismaService } from './prisma/prisma.service';
import { TamuModule } from './tamu/tamu.module';
import { ScanModule } from './scan/scan.module';
import { ScanController } from './scan/scan.controller';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { MahasiswaController } from './mahasiswa/mahasiswa.controller';
import { CryptoService } from './crypto/crypto/CryptoService';
import { FileModule } from './file/file.module';
import { CryptoModule } from './crypto/crypto/crypto.module';
import { PresensiModule } from './presensi/presensi/presensi.module';
import { EditorModule } from './editor/editor.module';
import { QrCodeService } from './scan/qr/qr.service';


@Module({

  imports: [
    PrismaModule, 
    AuthModule,
    TamuModule,
    ScanModule,
    MahasiswaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FileModule,
    CryptoModule,
    PresensiModule,
    EditorModule
  ],

  controllers: [AuthController, AppController, ScanController, MahasiswaController],

  providers: [
    AppService, PrismaService, CryptoService],
})


export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
