import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tamu, Prisma } from '@prisma/client';

@Injectable()
export class TamuService {
  constructor(private prisma: PrismaService) {}

  // 🟩 1️⃣ PAGINATION + SEARCH
  async getTamuWithPagination(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // 🔍 Pencarian di nama, email, dan asal_instansi
    const where: Prisma.tamuWhereInput = search
      ? {
          OR: [
            { nama: { contains: search } },
            { email: { contains: search } },
            { asal_instansi: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tamu.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id_tamu: 'asc' },
      }),
      this.prisma.tamu.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  // 🟩 2️⃣ BULK CREATE (Upload banyak tamu dari Excel)
  async bulkCreate(data: Prisma.tamuCreateManyInput[]) {
    return this.prisma.tamu.createMany({
      data,
      skipDuplicates: true,
    });
  }

  // 🟩 3️⃣ GET TAMU by ID
  async tamu(where: Prisma.tamuWhereUniqueInput): Promise<tamu | null> {
    return this.prisma.tamu.findUnique({ where });
  }

  // 🟩 4️⃣ GET SEMUA TAMU
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

  // 🟩 5️⃣ CREATE 1 TAMU
  async createTamu(data: Prisma.tamuCreateInput): Promise<tamu> {
    return this.prisma.tamu.create({ data });
  }

  // 🟩 6️⃣ UPDATE TAMU
  async updateTamu(params: {
    where: Prisma.tamuWhereUniqueInput;
    data: Prisma.tamuUpdateInput;
  }): Promise<tamu> {
    return this.prisma.tamu.update(params);
  }

  // 🟩 7️⃣ DELETE TAMU
  async deleteTamu(where: Prisma.tamuWhereUniqueInput): Promise<tamu> {
    return this.prisma.tamu.delete({ where });
  }
}
