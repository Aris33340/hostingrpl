import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import QRDTO from './dto/qroptions.dto';
import QRCodeStyling from 'qr-code-styling';
import * as nodeCanvas from "canvas";
import { JSDOM } from "jsdom";
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService } from 'src/crypto/crypto/CryptoService';

@Injectable()
export class QrCodeService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) { }
  async createQR(data: string, qrDto?: QRDTO) {
    let saveBuffer: Buffer;
    const qrCodeImage = new QRCodeStyling({
      jsdom: JSDOM, // this is required
      nodeCanvas, // this is required,
      ...qrDto,
      data,
      margin: 10,
      qrOptions: {
        errorCorrectionLevel: qrDto?.qrOptions?.errorCorrectionLevel ?? 'H',

      },
      imageOptions: {
        saveAsBlob: true,
        crossOrigin: "anonymous",
        margin: 50
      },
    });

    const buffer = await qrCodeImage.getRawData("png");

    if (!buffer) {
      throw new Error("QR getRawData() returned null");
    }

    if (buffer instanceof Blob) {
      const arrayBuffer = await buffer.arrayBuffer();
      saveBuffer = Buffer.from(arrayBuffer);
    }
    else if (Buffer.isBuffer(buffer)) {
      saveBuffer = buffer;
    } else {
      throw new Error("Unknown buffer format returned by qrCodeImage.getRawData()");
    }

    return saveBuffer;
    // else {
    //   throw new Error("Unknown buffer format returned by qrCodeImage.getRawData()");
    // }
    // if (!fs.existsSync(`./public/qr-generate/${qrDto.folderName}`)) {
    //   fs.mkdirSync(`./public/qr-generate/${qrDto.folderName}`, { recursive: true });
    // }
    // fs.writeFileSync(`./public/qr-generate/${qrDto.folderName}/${qrDto.fileName}.png`, saveBuffer);
  }

  async generateQRmahasiswa() {
    try {
      const mahasiswa = await this.prisma.presensi.findMany({
        where: { peserta: { jenis: 'mahasiswa' } },
        select: {

          id_presensi: true, peserta: {
            select:
            {
              id_peserta: true,
              mahasiswa: { select: { nim: true } }
            }
          }
        }
      });
      const result = await Promise.all(
        mahasiswa.map(async (data) => {
          const id_presensi = data.id_presensi;
          const nim = data.peserta?.mahasiswa?.nim;
          const id_peserta = data.peserta.id_peserta;

          const encryptedData = this.crypto.encrypt(String(id_presensi));
          const qrBuffer = await this.createQR(encryptedData);

          return {
            id_presensi,
            id_peserta,
            nim,
            qrBuffer
          };
        })
      );

      return result;
    } catch (error) {
      throw new NotFoundException('Data Presensi Tidak ditemukan');
    }
  }
}
