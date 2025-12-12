import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tamu, Prisma } from '@prisma/client';

@Injectable()
export class TamuService {
  constructor(private prisma: PrismaService) { }

  // 🟦 Ambil list instansi unik (untuk dropdown filter)
  async getAllInstansi() {
    return this.prisma.tamu.findMany({
      distinct: ['asal_instansi'],
      select: { asal_instansi: true },
      orderBy: { asal_instansi: 'asc' },
    });
  }

  // 🟩 1️⃣ PAGINATION + SEARCH + FILTER instansi
  async getTamuWithPagination(
    search: string,
    page: number,
    limit: number,
    instansi?: string,
    presensiStatus?:number   // ⬅ filter tambahan
  ) {
    const skip = (page - 1) * limit;

    // 🔍 Build search conditions
    const searchConditions: Prisma.tamuWhereInput[] = [];
    if (search) {
      searchConditions.push(
        { nama: { contains: search } },
        { email: { contains: search } },
        { asal_instansi: { contains: search } }
      );
    }

    // 🔵 Filter instansi jika ada
    const filterCondition: Prisma.tamuWhereInput = instansi
      ? { asal_instansi: instansi }
      : {};

    // 🔵 Final WHERE
    const presensiCondition: Prisma.tamuWhereInput = 
    presensiStatus !== undefined ?
    {
      peserta:{
        some:{
          presensis:{
            some:{
              status:presensiStatus
            }
          }
        }
      }
    }:{};

    const where: Prisma.tamuWhereInput = {
      AND: [
        search ? { OR: searchConditions } : {},
        filterCondition,presensiCondition
      ],
    };


    const [data, total] = await this.prisma.$transaction([
      this.prisma.tamu.findMany({
        skip,
        take: limit,
        where,
        include: {
          peserta: {
            include: {
              presensis: true
            }
          }
        },
        orderBy: { id_tamu: 'asc' },
        // --- PERBAIKAN DI SINI ---
        // Update include agar membawa data files
        // include: {
        //   peserta: {
        //     include: { files: true }
        //   }
        // }
      }),
      this.prisma.tamu.count({ where }),
    ]);

    return { data, total, page, limit};
  }

  // 🟩 2️⃣ BULK CREATE (Upload banyak tamu dari Excel) - tanpa duplikat nama/email/instansi
  async bulkCreate(data: Prisma.tamuCreateManyInput[],userId:number): Promise<{ inserted: number; duplicates: string[] }> {
    // Filter data valid
    const validData = data.filter(d => d.nama && d.email && d.asal_instansi)

    // Ambil data tamu yang sudah ada (kombinasi nama + email + asal_instansi)
    const existing = await this.prisma.tamu.findMany({
      where: {
        OR: validData.map(d => ({
          nama: d.nama,
          email: d.email,
          asal_instansi: d.asal_instansi
        }))
      },
      select: { nama: true, email: true, asal_instansi: true }
    })

    // Buat array string untuk tracking duplicate
    const existingKeys = existing.map(e => `${e.nama} | ${e.email} | ${e.asal_instansi}`)

    // Pisahkan data baru dan duplicate
    const newData = validData.filter(d => !existingKeys.includes(`${d.nama} | ${d.email} | ${d.asal_instansi}`))
    const duplicateKeys = validData
      .filter(d => existingKeys.includes(`${d.nama} | ${d.email} | ${d.asal_instansi}`))
      .map(d => `${d.nama} (${d.email} - ${d.asal_instansi})`)

    // Insert data baru
    if (newData.length > 0) {
      await this.prisma.tamu.createMany({ data: newData, skipDuplicates: true })
      const tamu = await this.prisma.tamu.findMany({
        where: {
          email: {
            in: newData.map(e => e.email)
          }
        },
        select:{
          id_tamu:true
        }
      })
      await this.prisma.peserta.createMany({data:tamu.map(e => ({id_tamu:e.id_tamu,jenis:'tamu'}))})
      const peserta = await this.prisma.peserta.findMany({
        where:{
          id_tamu:{
            in:tamu.map(e => e.id_tamu)
          }
        },
        select:{id_peserta:true}
      })
      await this.prisma.presensi.createMany({data:peserta.map(e => ({id_peserta:e.id_peserta,id_user:userId}))})
    }

    return { inserted: newData.length, duplicates: duplicateKeys }
  }


  // 🟩 3️⃣ GET TAMU by ID
  async tamu(where: Prisma.tamuWhereUniqueInput): Promise<tamu | null> {
    return this.prisma.tamu.findUnique({ 
      where,
      // --- PERBAIKAN DI SINI ---
      include: { 
        peserta: {
          include: { files: true }
        } 
      } 
    });
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
      // --- PERBAIKAN DI SINI ---
      include: {
        peserta: {
          include: { files: true }
        }
      }
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