import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BullModule } from '@nestjs/bull';
import { MahasiswaService } from "src/mahasiswa/mahasiswa.service";
import { TestingPdfRenderProcessor } from "./PdfEditorProcessor.service";
import { TestingEditorController } from "./editor.controller";
import { EditorService } from "./editor.service";
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
    providers:[PrismaService,TestingPdfRenderProcessor,EditorService,PrismaService,MahasiswaService,QrCodeService,CryptoService],
    controllers:[TestingEditorController]
})
export class EditorModule{}