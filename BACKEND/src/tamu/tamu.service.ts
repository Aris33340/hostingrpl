
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { tamu, Prisma } from '@prisma/client'

@Injectable()
export class TamuService {
  constructor(private prisma: PrismaService) {}

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
