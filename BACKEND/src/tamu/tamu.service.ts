import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tamu, Prisma } from '@prisma/client'

@Injectable()
export class TamuService {
  constructor(private prisma: PrismaService) {}

  /**
   * Mengambil data Tamu dengan Paginasi dan Pencarian (Search).
   * Ini mengatasi error 'getTamuWithPagination' does not exist.
   */
async getTamuWithPagination(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Menentukan kondisi WHERE berdasarkan input pencarian
    const where: Prisma.tamuWhereInput = search
      ? {
          // Perbaikan untuk Error TS2322: Hapus 'mode: 'insensitive''
          nama: {
            contains: search,
            // Hapus baris ini: mode: 'insensitive', 
          },
        }
      : {};

    // Menggunakan $transaction untuk menjalankan dua query secara efisien
    const [data, total] = await this.prisma.$transaction([
      // 1. Query untuk mengambil data (dengan skip dan take/limit)
      this.prisma.tamu.findMany({
        skip: skip,
        take: limit,
        where: where,
        orderBy: {
          id_tamu: 'asc', // Sesuaikan dengan kolom pengurutan default Anda
        },
      }),
      // 2. Query untuk menghitung total data yang cocok dengan kondisi (untuk paginasi)
      this.prisma.tamu.count({ where: where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Menyimpan banyak data Tamu sekaligus (Bulk Create).
   * Ini mengatasi error 'bulkCreate' does not exist.
   */
  async bulkCreate(data: Prisma.tamuCreateManyInput[]) {
    // Prisma createMany digunakan untuk insert data dalam jumlah besar
    return this.prisma.tamu.createMany({
      data: data,
      skipDuplicates: true, // Opsi untuk melewati duplikat jika kunci unik sudah ada
    });
  }

  // --- Method yang sudah ada (tidak diubah) ---

  async tamu(
    tamuWhereUniqueInput: Prisma.tamuWhereUniqueInput,
  ): Promise<tamu | null> {
    return this.prisma.tamu.findUnique({
      where: tamuWhereUniqueInput,
    });
  }

  async tamus(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.tamuWhereUniqueInput;
    where?: Prisma.tamuWhereInput;
    orderBy?: Prisma.tamuOrderByWithRelationInput;
  }): Promise<tamu[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.tamu.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTamu(data: Prisma.tamuCreateInput): Promise<tamu> {
    return this.prisma.tamu.create({
      data,
    });
  }

  async updateTamu(params: {
    where: Prisma.tamuWhereUniqueInput;
    data: Prisma.tamuUpdateInput;
  }): Promise<tamu> {
    const { where, data } = params;
    return this.prisma.tamu.update({
      data,
      where,
    });
  }

  async deleteTamu(where: Prisma.tamuWhereUniqueInput): Promise<tamu> {
    return this.prisma.tamu.delete({
      where,
    });
  }
}
