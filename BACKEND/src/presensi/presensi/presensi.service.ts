import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PresensiService {
    constructor(private prisma:PrismaService){}

    async getAllPresensi(){
        try{
            const data = await this.prisma.presensi.findMany();
            return data;
        }catch(e){
            throw new BadRequestException("Data Tidak Ditemukan")
        }
    }

}
