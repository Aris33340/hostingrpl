import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
<<<<<<< HEAD
import { mahasiswa, Prisma } from '@prisma/client'
=======
import { mahasiswa, Prisma } from '@prisma/client';
>>>>>>> origin/tya

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) { }

<<<<<<< HEAD
  async getFieldMhs() {
    return Object.keys(Prisma.MahasiswaScalarFieldEnum)
  }

=======
>>>>>>> origin/tya
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
        include: {
          peserta: {
            select: {
              presensis: {
                select: {
                  status: true,
                  waktu_presensi: true
                }
              }
            }
          }
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mahasiswa.count({ where }),
    ]);

    const finalResult = data.map((mhs) => {
      const presensiTerbaru = mhs.peserta.flatMap((p) => p.presensis)[0] || null;

      return {
        id: mhs.nim,
        nama: mhs.nama,
        statusPresensi: presensiTerbaru,
      };
    });


    return { data: data, page, limit, total };
  }


  // 🟩 4️⃣ Tambah satu mahasiswa
  async createMahasiswa(
    data: Prisma.mahasiswaCreateInput,
  ): Promise<mahasiswa> {
    const mahasiswa = await this.prisma.mahasiswa.create({ data });
    const peserta = await this.prisma.peserta.create({
      data: {
        nim: Number(mahasiswa.nim),
        jenis: 'mahasiswa'
      }
    })

    await this.prisma.presensi.create({
      data: {
        id_peserta: Number(peserta.id_peserta)
      }
    })
    return mahasiswa;
  }
  // 🟩 5️⃣ Tambah banyak mahasiswa (import Excel)
  async createManyMahasiswa(
    data: Prisma.mahasiswaCreateManyInput[],
  ): Promise<{ count: number }> {
<<<<<<< HEAD

    const validData = data.filter((d) => d.nim && d.nama);

=======
    
    const validData = data.filter((d) => d.nim && d.nama);
    
>>>>>>> origin/tya
    const mahasiswas = await this.prisma.mahasiswa.createMany({
      data: validData,
      skipDuplicates: true,
    });
    await this.prisma.peserta.createMany({
      data: validData.map((e) => ({
        nim: Number(e.nim),
        jenis: 'mahasiswa'
      })), skipDuplicates: true
    });
    const pesertas = await this.prisma.peserta.findMany();
    await this.prisma.presensi.createMany({
      data: pesertas.map((e) => ({
        id_peserta: Number(e.id_peserta)
      })), skipDuplicates: true
    })
    return mahasiswas;
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
