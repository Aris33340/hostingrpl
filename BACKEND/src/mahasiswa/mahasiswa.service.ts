import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mahasiswa, Prisma } from 'generated/prisma';

@Injectable()
export class MahasiswaService {
  constructor(private prisma: PrismaService) { }

  async mahasiswa(
    tamuWhereUniqueInput: Prisma.mahasiswaWhereUniqueInput,
  ): Promise<mahasiswa | null> {
    return this.prisma.mahasiswa.findUnique({
      where: tamuWhereUniqueInput,
    });
  }

  async mahasiswas(): Promise<mahasiswa[]> {
    return this.prisma.mahasiswa.findMany();
  }

  async createMahasiswa(data: Prisma.mahasiswaCreateInput): Promise<mahasiswa> {
    return this.prisma.mahasiswa.create({
      data,
    });
  }

  async createManyMahasiswa(
    data: Prisma.mahasiswaCreateManyInput[],
  ): Promise<{ count: number }> {
    return this.prisma.mahasiswa.createMany({
      data,
      skipDuplicates: true,
    });
  }
  
  async updateMahasiswa(params: {
    where: Prisma.mahasiswaWhereUniqueInput;
    data: Prisma.mahasiswaUpdateInput;
  }): Promise<mahasiswa> {
    const { where, data } = params;
    return this.prisma.mahasiswa.update({
      data,
      where,
    });
  }

  async deleteMahasiswa(where: Prisma.mahasiswaWhereUniqueInput): Promise<mahasiswa> {
    return this.prisma.mahasiswa.delete({
      where,
    });
  }
}
