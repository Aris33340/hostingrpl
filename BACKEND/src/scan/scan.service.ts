import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto/CryptoService';

@Injectable()
export class ScanService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) { }

  async getScanData(x: string): Promise<any> {
    let ID: any;

    try {
      ID = this.crypto.decrypt(x);
      if (!ID) {
        throw new BadRequestException('QR Tidak Valid');
      }

      const presensiStatus = await this.prisma.presensi.findUnique({
        where: { id_peserta: Number(ID) },
      });

      if (!presensiStatus) {
        throw new NotFoundException('ID Presensi Tidak Ditemukan');
      }

      if (presensiStatus.status !== 0) {
        throw new ConflictException('Peserta sudah hadir');
      }

      const data = await this.prisma.peserta.findUnique({
        where: { id_peserta: Number(ID) },
        select: { jenis: true, mahasiswa: true, tamu: true, presensis: true },
      });

      if (!data) {
        throw new NotFoundException('Peserta tidak ditemukan');
      }

      return data;

    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException('QR Tidak Valid / Terjadi Kesalahan');
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
