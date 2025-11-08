import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mahasiswa, Prisma } from 'generated/prisma';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) {}

  // 🟩 1️⃣ Ambil satu mahasiswa berdasarkan unique key (id/nim)
  async mahasiswa(
    where: Prisma.mahasiswaWhereUniqueInput,
  ): Promise<mahasiswa | null> {
    return this.prisma.mahasiswa.findUnique({ where });
  }

  // 🟩 2️⃣ Ambil semua data mahasiswa (tanpa pagination)
  async mahasiswas(): Promise<mahasiswa[]> {
    return this.prisma.mahasiswa.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🟩 3️⃣ Ambil mahasiswa dengan fitur search & pagination
async getMahasiswaWithPagination(search?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const where: Prisma.mahasiswaWhereInput = search
    ? {
        OR: [
          { nama: { contains: search } },
          { prodi: { contains: search } },
          { kelas: { contains: search } },
          { no_telp: { contains: search } },
          { nama_orang_tua: { contains: search } },
          { judul_skripsi: { contains: search } },
          { dosen_pembimbing: { contains: search } },
          { daerah_asal: { contains: search } },
          { daerah_penempatan: { contains: search } },
          !isNaN(Number(search))
            ? { nim: { equals: Number(search) } }
            : undefined,
        ].filter(Boolean) as any,
      }
    : {};

  const [data, total] = await Promise.all([
    this.prisma.mahasiswa.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.mahasiswa.count({ where }),
  ]);

  return { data, page, limit, total };
}


  // 🟩 4️⃣ Tambah satu mahasiswa
  async createMahasiswa(
    data: Prisma.mahasiswaCreateInput,
  ): Promise<mahasiswa> {
    return this.prisma.mahasiswa.create({ data });
  }

  // 🟩 5️⃣ Tambah banyak mahasiswa (import Excel)
  async createManyMahasiswa(
    data: Prisma.mahasiswaCreateManyInput[],
  ): Promise<{ count: number }> {
    const validData = data.filter((d) => d.nim && d.nama); // validasi dasar
    return this.prisma.mahasiswa.createMany({
      data: validData,
      skipDuplicates: true,
    });
  }

  // 🟩 6️⃣ Update mahasiswa
  async updateMahasiswa(params: {
    where: Prisma.mahasiswaWhereUniqueInput;
    data: Prisma.mahasiswaUpdateInput;
  }): Promise<mahasiswa> {
    const { where, data } = params;
    return this.prisma.mahasiswa.update({ where, data });
  }

  // 🟩 7️⃣ Hapus mahasiswa
  async deleteMahasiswa(
    where: Prisma.mahasiswaWhereUniqueInput,
  ): Promise<mahasiswa> {
    return this.prisma.mahasiswa.delete({ where });
  }
}
