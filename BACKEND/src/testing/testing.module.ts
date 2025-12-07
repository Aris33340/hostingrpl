import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BullModule } from '@nestjs/bull';
import { MahasiswaService } from "src/mahasiswa/mahasiswa.service";
import { TestingPdfRenderProcessor } from "./TestingPdfRenderProcessor.service";
import { TestingEditorController } from "./testing.controller";
import { TestingEditorService } from "./TestingEditor.service";
import { QrCodeService } from "src/qr/qr.service";
import { CryptoService } from "src/crypto/crypto/CryptoService";

@Module({
    imports: [
        BullModule.forRoot({
          redis: {
            host: 'localhost',
            port: 6379,
          },
        }),
        BullModule.registerQueue({
          name: 'pdf-render-queue',
        }),
      ],
    providers:[PrismaService,TestingPdfRenderProcessor,TestingEditorService,PrismaService,MahasiswaService,QrCodeService,CryptoService],
    controllers:[TestingEditorController]
})
export class TestingModule{}