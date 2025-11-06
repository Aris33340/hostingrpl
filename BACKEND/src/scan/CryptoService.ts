import crypto from "crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CryptoService {
  private readonly algorithm = "aes-256-cbc";
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor() {
    this.key = Buffer.from("00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff", "hex");
    this.iv = Buffer.from("aabbccddeeff00112233445566778899", "hex");
  }

  encrypt(text: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  decrypt(content: string ) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      this.iv,
    );
    let decrypted = decipher.update(content, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
