
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PesertaService {
  constructor(private prisma: PrismaService) { }
  async getFieldLength(table: string, select: Prisma.mahasiswaSelect | Prisma.tamuSelect, lengthType: string) {
    let peserta: any;
    switch (table) {
      case 'mahasiswa':
        peserta = await this.prisma.mahasiswa.findMany({ select: select })
        break;
      case 'tamu':
        peserta = await this.prisma.tamu.findMany({ select: select })
        break;
      default:
        break;
    }
    const keys = Object.keys(select);
    const firstKey = keys[0]
    let sum = 0
    let count = 0
    let max = 0
    let min = String({ ...peserta[0] }[firstKey]).length
    let average = 0
    let value = { ...peserta[0] }[firstKey]
    peserta.forEach((data: any) => {
      const keyValue = { ...data }[firstKey]
      const keyValueLength = String(keyValue).length
      sum += keyValueLength
      count++
      average = sum / count
      switch (lengthType) {
        case 'max':
          if (keyValueLength > max) {
            max = keyValueLength
            value = keyValue
          }
          break;
        case 'min':
          if (keyValueLength < min) {
            min = keyValueLength
            value = keyValue
          }
          break;
        case 'average':
          if (keyValueLength >= Math.floor(average) && keyValueLength <= Math.ceil(average)) {
            value = keyValue
          }
          break;
        default:
          break;
      }
    })
    return value
  }
  
  async getFields(table: string) {
    let fields: any;
    switch (table) {
      case 'mahasiswa':
        fields = Object.keys(Prisma.MahasiswaScalarFieldEnum)
        break;
      case 'tamu':
        fields = Object.keys(Prisma.TamuScalarFieldEnum)
        break;
      default:
        fields = []
        break;
    }
    return fields
  }
}
