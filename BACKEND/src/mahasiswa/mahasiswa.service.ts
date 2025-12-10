import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mahasiswa, Prisma } from '@prisma/client'

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) { }

  async getFieldMhs() {
    return Object.keys(Prisma.MahasiswaScalarFieldEnum)
  }

  // 🟦 Ambil list kelas unik
  async getAllKelas() {
    return this.prisma.mahasiswa.findMany({
      distinct: ['kelas'],
      select: { kelas: true },
      orderBy: { kelas: 'asc' }
    });
  }

  // 🟦 Ambil list prodi unik
  async getAllProdi() {
    return this.prisma.mahasiswa.findMany({
      distinct: ['prodi'],
      select: { prodi: true },
      orderBy: { prodi: 'asc' }
    });
  }

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

  // 🟩 3️⃣ Ambil mahasiswa dengan search + pagination + filter kelas/prodi
  async getMahasiswaWithPagination(
    search?: string,
    page = 1,
    limit = 10,
    filter?: string,
    presensiStatus?: number, // ⬅️ DITAMBAHKAN
    peminatan?: string,
    kelas?: string,
  ) {
    const skip = (page - 1) * limit;
    const isNumberSearch = !isNaN(Number(search));

    // 🔵 BUILD SEARCH CONDITIONS
    const searchConditions: Prisma.mahasiswaWhereInput[] = [];

    if (search) {
      searchConditions.push(
        { nama: { contains: search } },
        { prodi: { contains: search } },
        { kelas: { contains: search } },
        { no_telp: { contains: search } },
        { nama_orang_tua: { contains: search } },
        { judul_skripsi: { contains: search } },
        { dosen_pembimbing: { contains: search } },
        { daerah_asal: { contains: search } },
        { daerah_penempatan: { contains: search } }
      );

      // Jika angka → exact match
      if (isNumberSearch) {
        searchConditions.push({ nim: Number(search) });

        const partialMatchNim = await this.prisma.mahasiswa.findMany({
          select: { nim: true },
        });

        const matchedNims = partialMatchNim
          .filter((r) => String(r.nim).includes(search))
          .map((r) => r.nim);

        searchConditions.push({
          nim: { in: matchedNims }
        });
      }
    }

    const prodiKelasFilter: Prisma.mahasiswaWhereInput = {};
    const list = [
      { peminatan: "KS", kelas: ["SD", "SI"] },
      { peminatan: "ST", kelas: ["SE", "SK"] },
      { peminatan: "D3", kelas: ["D3"] },
    ]
    const listSelected = list.filter(e => String(e.peminatan).includes(peminatan ?? ''))
    if (kelas) {
      // user pilih kelas lengkap → filter exact
      prodiKelasFilter.OR = [{kelas:{contains:kelas}}];
    } else if (peminatan) {
      // user hanya pilih peminatan → kelas diawali kode prodi
      prodiKelasFilter.OR = listSelected[0].kelas.map(e => ({ kelas: { contains: e } }))
    }

    // 🔵 FILTER kelas / prodi
    const filterCondition: Prisma.mahasiswaWhereInput = filter
      ? {
        OR: [
          { kelas: filter },
          { prodi: filter },
        ],
      }
      : {};

    // 🔵 FILTER berdasarkan status presensi
    const presensiStatusCondition: Prisma.mahasiswaWhereInput =
      presensiStatus !== undefined
        ? {
          peserta: {
            some: {
              presensis: {
                some: { status: presensiStatus }
              }
            }
          }
        }
        : {};

    // 🔵 FINAL WHERE
    const where: Prisma.mahasiswaWhereInput = {
      AND: [
        search ? { OR: searchConditions } : {},
        filterCondition,
        prodiKelasFilter,
        presensiStatusCondition
      ]
    };

    // 🔵 QUERY
    const [data, total] = await Promise.all([
      this.prisma.mahasiswa.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          peserta: {
            select: {
              presensis: {
                select: {
                  status: true,
                  waktu_presensi: true,
                  id_presensi: true
                },
                where:
                  presensiStatus !== undefined
                    ? { status: presensiStatus }
                    : {},
              },
            },
          },
        },
      }),

      this.prisma.mahasiswa.count({ where }),
    ]);

    return { data, page, limit, total };
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
    });

    await this.prisma.presensi.create({
      data: {
        id_peserta: Number(peserta.id_peserta)
      }
    });

    return mahasiswa;
  }

  // 🟩 5️⃣ Tambah banyak mahasiswa (import Excel) - dengan validasi duplicate
  async createManyMahasiswa(
    data: Prisma.mahasiswaCreateManyInput[],
  ): Promise<{ inserted: number; duplicates: string[] }> {

    const validData = data.filter((d) => d.nim && d.nama);

    // 🔵 Ambil NIM yang sudah ada di database
    const existing = await this.prisma.mahasiswa.findMany({
      where: { nim: { in: validData.map(d => Number(d.nim)) } },
      select: { nim: true },
    });
    const existingNims = existing.map(e => String(e.nim));

    // 🔵 Pisahkan data baru dan duplicate
    const newData = validData.filter(d => !existingNims.includes(String(d.nim)));
    const duplicateNims = validData
      .filter(d => existingNims.includes(String(d.nim)))
      .map(d => String(d.nim));

    // 🔵 Insert data baru
    if (newData.length > 0) {
      await this.prisma.mahasiswa.createMany({ data: newData });
      await this.prisma.peserta.createMany({
        data: newData.map(e => ({ nim: Number(e.nim), jenis: 'mahasiswa' })),
      });

      const pesertas = await this.prisma.peserta.findMany();
      await this.prisma.presensi.createMany({
        data: pesertas.map(e => ({ id_peserta: Number(e.id_peserta) })),
        skipDuplicates: true,
      });
    }

    return { inserted: newData.length, duplicates: duplicateNims };
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
