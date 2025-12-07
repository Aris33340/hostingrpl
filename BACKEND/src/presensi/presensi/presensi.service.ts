import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PresensiService {
    constructor(private prisma: PrismaService) { }

    async getAllPresensi() {
        try {
            const data = await this.prisma.presensi.findMany();
            return data;
        } catch (e) {
            throw new BadRequestException("Data Tidak Ditemukan")
        }
    }

    async getInfoPresensi() {
        try {
            const presensi = await this.prisma.presensi.findMany({
                select: {
                    status: true,
                    peserta: { select: { jenis: true } },
                },
            });

            let info = {
                totalUndangan: presensi.length,
                totalUndanganHadir: 0,
                totalUndanganTidakHadir: 0,
                totalUndanganMahasiswa: 0,
                mahasiswaHadir: 0,
                mahasiswaTidakHadir: 0,
                totalUndanganTamu: 0,
                tamuHadir: 0,
                tamuTidakHadir: 0,
            };

            for (const p of presensi) {
                if (p.status === 1) {
                    info.totalUndanganHadir++;
                } else {
                    info.totalUndanganTidakHadir++;
                }
                if (p.peserta.jenis === 'mahasiswa') {
                    info.totalUndanganMahasiswa++;
                    if (p.status === 1) info.mahasiswaHadir++;
                    else info.mahasiswaTidakHadir++;
                } else if (p.peserta.jenis === 'tamu') {
                    info.totalUndanganTamu++;
                    if (p.status === 1) info.tamuHadir++;
                    else info.tamuTidakHadir++;
                }
            }

            return info;
        } catch (e) {
            throw new NotFoundException('data tidak ditemukan');
        }
    }

    async getPesertaByIdPresensi(id:number){
        try {
            const res = this.prisma.presensi.findFirst({
                select:{
                    peserta:{
                        select:{
                            mahasiswa:{
                                select:{
                                    nama:true,nim:true,prodi:true,kelas:true
                                }
                            },tamu:true
                        }
                    }
                },
                where:{
                    id_presensi:id
                }
            })
            return res;
        } catch (error) {
            throw error;
        }
    }

    async getPresensiByNim(nim: number) {
        try {
            // const presMahasiswa = await this.prisma.presensi.findFirst({
            //     select: {
            //         id_presensi: true,
            //         waktu_presensi: true,
            //         status: true,
            //         peserta: {
            //             select: {
            //                 mahasiswa: {
            //                     select: {
            //                         nim: true,
            //                         nama: true,
            //                         kelas: true,
            //                         prodi: true,
            //                     },
            //                 },
            //             },
            //         },
            //     },
            //     where: {
            //         peserta: {
            //             mahasiswa:{
            //                 nim: nim
            //             }
            //         }
            //     }
            // });

            // if (!presMahasiswa) {
            //     throw new HttpException('Data dengan nim tersebut tidak ditemukan', HttpStatus.BAD_REQUEST)
            // }

            // return presMahasiswa;
            return this.prisma.presensi.findMany({where:{
                peserta:{
                    mahasiswa:{
                        nim:nim
                    }
                }
            }})
        } catch (e) {
            throw new BadRequestException('Terjadi kesalahan saat mengambil data');
        }
    }

    async setPresensiHadir(idPresensi: number) {
        const presensi = await this.prisma.presensi.findUnique({
            where: { id_presensi: idPresensi },
        });

        if (!presensi) {
            throw new NotFoundException('Presensi tidak ditemukan');
        }

        if (presensi.status === 1) {
            return {message:'sudah ditandai hadir',
                STATUS_CODES:HttpStatus.CONFLICT
            }
        }

        await this.prisma.presensi.update({
            where: { id_presensi: idPresensi },
            data: { status: 1 },
        });

        return {
            message: 'Berhasil menandai status kehadiran',
            STATUS_CODES: HttpStatus.OK,
        };
    }


    async setPresensiTidakHadir(idPresensi: number) {
        const presensi = await this.prisma.presensi.findUnique({
            where: { id_presensi: idPresensi },
        });

        if (!presensi) {
            throw new NotFoundException('Presensi tidak ditemukan');
        }

        if (presensi.status === 0) {
            throw new ConflictException('Status sudah ditandai tidak hadir');
        }

        await this.prisma.presensi.update({
            where: { id_presensi: idPresensi },
            data: { status: 0 },
        });

        return {
            message: 'Berhasil membatalkan status kehadiran',
            STATUS_CODES: HttpStatus.OK,
        };
    }

    async setAllPresensiHadir(){
        try {
            await this.prisma.presensi.updateMany({
                data:{
                    status:1
                },
                where:{
                    status:0
                }
            })
            return {
                message: 'Berhasil menandai seluruh status presensi sebagai hadir',
                STATUS_CODES: HttpStatus.OK,
            }
        } catch (e) {
            throw new BadRequestException('Gagal menandai hadir',e);
        }
    }
    
    async setAllPresensiTidakHadir(){
        try {
            await this.prisma.presensi.updateMany({
                data:{
                    status:0
                },
                where:{
                    status:1
                }
            })
            return {
                message: 'Berhasil menandai seluruh status presensi sebagai tidak hadir',
                STATUS_CODES: HttpStatus.OK,
            }
        } catch (e) {
            throw new BadRequestException('Gagal menandai Tidak hadir',e);
        }
    }

}
