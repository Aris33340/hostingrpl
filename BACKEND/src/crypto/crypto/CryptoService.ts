import crypto from "crypto";
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CryptoService {
  private readonly algorithm = "aes-256-cbc";
  private key: string = "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff";
  private iv: string = "aabbccddeeff00112233445566778899";
  private keyBuffer: Buffer = Buffer.from(this.key, "hex");
  private ivBuffer: Buffer = Buffer.from(this.iv, "hex");

  constructor(private prismaService: PrismaService) {
    this.keyBuffer = Buffer.from(this.key, "hex");
    this.ivBuffer = Buffer.from(this.iv, "hex");
  }

  async setKey() {
    const hashKey = await this.prismaService.settings.findUnique({
      where: { key: 'hashKey' }
    });

    const rawKey = hashKey?.value ?? this.key;

    this.keyBuffer = crypto.createHash("sha256")
      .update(rawKey)
      .digest();
  }
  setIv(iv: string) {
    this.iv = iv;
  }

  async encrypt(text: string) {
    try {
      if (!text) {
        throw new BadRequestException('Teks untuk enkripsi tidak boleh kosong.');
      }
      await this.setKey()
      console.log(this.key)
      const cipher = crypto.createCipheriv(this.algorithm, this.keyBuffer, this.ivBuffer);
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    } catch (error) {
      throw new InternalServerErrorException(`Gagal mengenkripsi data: ${error.message}`);
    }
  }

  async decrypt(content: string) {
    try {
      if (!content) {
        throw new BadRequestException('Teks untuk dekripsi tidak boleh kosong.');
      }
      await this.setKey()
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
