import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  /* ================================
      SIMPAN FILE BIASA (PDF TAMU)
  =================================*/
  async saveFile(file: Express.Multer.File, userId: number) {
    return this.prisma.file.create({
      data: {
        file_name: file.filename,
        path: file.path,
        type: 'PDF_TAMU',
        userId_user: userId,
      },
    });
  }

  /* ================================
      UPLOAD & EXTRACT ZIP (MAHASISWA)
  =================================*/
  async importZip(file: Express.Multer.File, userId: number) {
    if (!file) throw new BadRequestException('Tidak ada file ZIP');

    const uploadDir = path.join(process.cwd(), `public/uploads/zip-extracted/${userId}`);

    // Pastikan folder ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const results: {
      file: string;
      nim?: number;
      status: string;
      reason?: string;
    }[] = [];


    // Buka ZIP langsung dari buffer
    const zip = await unzipper.Open.buffer(file.buffer);

    for (const entry of zip.files) {
      if (!entry.path.endsWith('.pdf')) {
        results.push({
          file: entry.path,
          status: 'FAILED',
          reason: 'File bukan PDF',
        });
        continue;
      }

      const nim = Number(entry.path.replace('.pdf', '').trim());

      if (!nim) {
        results.push({
          file: entry.path,
          status: 'FAILED',
          reason: 'Nama file bukan NIM secara valid',
        });
        continue;
      }

      const pdfPath = path.join(uploadDir, `${nim}.pdf`);

      // Simpan file PDF hasil ekstrak
      fs.writeFileSync(pdfPath, await entry.buffer());

      // Cari peserta berdasarkan NIM
      const peserta = await this.prisma.peserta.findFirst({
        where: { nim: nim },
      });

      // Simpan metadata file ke database
      await this.prisma.file.create({
        data: {
          file_name: `${nim}.pdf`,
          path: pdfPath,
          type: 'ZIP_MAHASISWA',
          userId_user: userId,
          pesertaId_peserta: peserta?.id_peserta || null,
        },
      });

      results.push({
        file: entry.path,
        nim,
        status: 'OK',
      });
    }

    return {
      message: 'ZIP berhasil diproses',
      results,
    };
  }

  /* ================================
      GET SEMUA FILE
  =================================*/
  async getAllFiles() {
    return this.prisma.file.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /* ================================
      GET FILE BY ID
  =================================*/
  async getFileById(id: number) {
    return this.prisma.file.findUnique({
      where: { id_file: id },
    });
  }

  /* ================================
      DELETE FILE
  =================================*/
  async deleteFileById(id: number) {
    const file = await this.prisma.file.findUnique({
      where: { id_file: id },
    });

    if (!file) return { message: 'File not found' };

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await this.prisma.file.delete({
      where: { id_file: id },
    });

    return { message: 'File deleted successfully' };
  }

  async saveZip(file: Express.Multer.File, userId: number) {
  return this.prisma.file.create({
    data: {
      file_name: file.originalname,
      path: file.path,
      type: "ZIP_TEMPLATE",
      userId_user: userId,   // ← gunakan kolom yang benar
    }
  });
}

}
