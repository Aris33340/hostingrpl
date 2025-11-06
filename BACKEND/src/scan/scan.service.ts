
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { presensi, Prisma } from 'generated/prisma';
import bcrypt from 'node_modules/bcryptjs';
import {CryptoService} from './CryptoService';

@Injectable()
export class ScanService {
  constructor(private prisma: PrismaService, private crypto: CryptoService) {}

  async getScanData(x: string): Promise<any | null>{
    const ID = this.crypto.decrypt(x);   
    const presensiStatus = await this.prisma.presensi.findFirst({select:{mahasiswa:true,tamu:true,status:true},
      where: {
        OR: [
          {nim:parseInt(ID)},{id_tamu:parseInt(ID)}
        ]
      }
    });
    if(!presensiStatus){
      throw new Error('Data not found');
    }

    return presensiStatus;
  }
}
