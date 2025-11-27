import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) { }

  async saveFile(file: Express.Multer.File, userId?: number) {
    const findFile = await this.prisma.file.findUnique({ where: { path: file.path } })
    if (!findFile) {
      return this.prisma.file.create({
        data: {
          file_name: file.originalname,
          path: file.path,
          type: file.mimetype,
          id_user: userId
        },
      });
    }
    return
  }

  async getFileById(id: number) {
    return this.prisma.file.findUnique({
      where: { id_file: id },
    });
  }


  async getAllFiles(userId: number, query?: string) {
    return this.prisma.file.findMany({
      where: {
        user: {
          id_user: userId
        },
        type: {
          contains: query
        }
      }
    });
  }

  async deleteFileById(id: number) {
    const fileRecord = await this.prisma.file.findUnique({
      where: { id_file: id },
    });

    if (!fileRecord) {
      throw new NotFoundException('File not found in database');
    }

    const filePath = join(process.cwd(), fileRecord.path);
    try {
      if (existsSync(filePath)) {
        try {
          unlinkSync(filePath);
        } catch (err) {
          throw new InternalServerErrorException(`Failed to delete file from disk: ${err.message}`);
        }
      } else {
        throw new NotFoundException('File not found on disk');
      }
    } catch (err) {
      throw err
    } finally {
      await this.prisma.file.delete({
        where: { id_file: id },
      });
    }
    return { message: 'File deleted successfully', deletedId: id };
  }

}
