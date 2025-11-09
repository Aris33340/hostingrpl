import crypto from "crypto";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CryptoService {
  private readonly algorithm = "aes-256-cbc";
  private key:string = "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff";
  private iv:string = "aabbccddeeff00112233445566778899";
  private keyBuffer: Buffer;
  private ivBuffer: Buffer;

  constructor() {
    this.keyBuffer = Buffer.from(this.key, "hex");
    this.ivBuffer = Buffer.from(this.iv, "hex");
  }
  setKey(key: string){
    this.key = key;
  }
  setIv(iv: string){
    this.iv = iv;
  }

  encrypt(text: string) {
    try {
      if (!text) {
        throw new BadRequestException('Teks untuk enkripsi tidak boleh kosong.');
      }
      const cipher = crypto.createCipheriv(this.algorithm, this.keyBuffer, this.ivBuffer);
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    } catch (error) {
      throw new InternalServerErrorException(`Gagal mengenkripsi data: ${error.message}`);
    }
  }

  decrypt(content: string) {
    try {
      if (!content) {
        throw new BadRequestException('Teks untuk dekripsi tidak boleh kosong.');
      }
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.keyBuffer,
        this.ivBuffer,
      );
      let decrypted = decipher.update(content, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return String(decrypted);

    } catch (error) {
      throw new InternalServerErrorException(`Gagal mendekripsi data: ${error.message}`);
    }
  }
}
