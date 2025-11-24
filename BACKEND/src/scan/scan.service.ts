import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto/CryptoService';

@Injectable()
export class ScanService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) { }

  async ScanData(x: string): Promise<any> {
    try {
      const encryptedData = this.crypto.decrypt(x); 
      return encryptedData;
    } catch (error) {
      throw error;
    }
  }

  async updateStatusPresensi(id: Number, status: Number) {
    try{
      const statusPresesni = await this.prisma.presensi.update({where:{id_presensi:Number(id)},data:{status:Number(status)}})
    }catch(e){
      throw new BadRequestException("Gagal memperbarui data")
    }
  }
}
