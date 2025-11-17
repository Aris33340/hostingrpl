import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import QRDTO from './dto/qroptions.dto';
import QRCodeStyling from 'qr-code-styling';
import * as nodeCanvas from "canvas";
import { JSDOM } from "jsdom";
import * as fs from 'fs';

@Injectable()
export class QrCodeService {
  async createQR(qrDto: QRDTO,path:string,nameFile:string) {
    const qrCodeImage = new QRCodeStyling({
      jsdom: JSDOM, // this is required
      nodeCanvas, // this is required,
      ...qrDto,
      imageOptions: {
        saveAsBlob: true,
        crossOrigin: "anonymous",
        margin: 20
      },
    });

    qrCodeImage.getRawData("png").then(async (buffer) => {
      if (!buffer) {
        throw new Error("QR getRawData() returned null");
      }

      let saveBuffer: Buffer;

      if (buffer instanceof Blob) {
        const arrayBuffer = await buffer.arrayBuffer();
        saveBuffer = Buffer.from(arrayBuffer);
      }

      else if (Buffer.isBuffer(buffer)) {
        saveBuffer = buffer;
      }

      else {
        throw new Error("Unknown buffer format returned by qrCodeImage.getRawData()");
      }
      if(!fs.existsSync(`./public/qr-generate/${qrDto.folderName}`)){
        fs.mkdirSync(`./public/qr-generate/${qrDto.folderName}`,{recursive:true});
      }
      fs.writeFileSync(`./public/qr-generate/${qrDto.folderName}/${qrDto.fileName}.png`, saveBuffer);
    });

  }
}
