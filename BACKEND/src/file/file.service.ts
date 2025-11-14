import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) { }

  async saveFile(file: Express.Multer.File, userId?: number, nim?: number) {
    return this.prisma.file.create({
      data: {
        file_name: file.originalname,
        path: file.path,
        type: file.mimetype,
        userId_user: 2
      },
    });
  }

  async getFileById(id: number) {
    return this.prisma.file.findUnique({
      where: { id_file: id },
    });
  }

  async getAllFiles() {
    return this.prisma.file.findMany();
  }

  async deleteFileById(id: number) {
    const fileRecord = await this.prisma.file.findUnique({
      where: { id_file: id },
    });

    if (!fileRecord) {
      throw new NotFoundException('File not found in database');
    }

    const filePath = join(process.cwd(), fileRecord.path);

    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
      } catch (err) {
        throw new InternalServerErrorException(`Failed to delete file from disk: ${err.message}`);
      }
    } else {
      throw new NotFoundException('File not found on disk');
    }

    try {
      await this.prisma.file.delete({
        where: { id_file: id },
      });
    } catch (err) {
      throw new InternalServerErrorException(`Failed to delete file record: ${err.message}`);
    }

    return { message: 'File deleted successfully', deletedId: id };
  }

}
