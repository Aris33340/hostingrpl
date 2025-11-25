import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // 1. IMPORT ZIP UNDANGAN (NIM.pdf)
  // ============================================================
  async importZip(file: Express.Multer.File) {
    const uploadDir = path.join(process.cwd(), 'uploads/final');

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const directory = await unzipper.Open.buffer(file.buffer);

    const results: any[] = [];

    for (const entry of directory.files) {
      if (!entry.path.endsWith('.pdf')) continue;

      const nim = Number(entry.path.replace('.pdf', '').trim());

      if (!nim) {
        results.push({
          file: entry.path,
          status: 'FAILED',
          reason: 'Nama file bukan NIM',
        });
        continue;
      }

      const extractedPath = path.join(uploadDir, `${nim}.pdf`);
      fs.writeFileSync(extractedPath, await entry.buffer());

      const peserta = await this.prisma.peserta.findFirst({ where: { nim } });

      await this.prisma.file.create({
        data: {
          file_name: `${nim}.pdf`,
          path: extractedPath,
          type: 'IMPORT_ZIP_PDF',
          userId_user: 1, // TODO: ganti dengan user login
          pesertaId_peserta: peserta?.id_peserta || null,
        },
      });

      results.push({ file: entry.path, nim, status: 'OK' });
    }

    return { message: 'ZIP diproses', results };
  }

  async getImportHistory() {
    return this.prisma.file.findMany({
      where: { type: 'IMPORT_ZIP_PDF' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================================
  // 2. ACCOUNT EMAIL PENGIRIM (SenderAccount)
  // ============================================================
  async createAccount(dto: any) {
    await this.prisma.senderAccount.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    return this.prisma.senderAccount.create({
      data: {
        email: dto.email,
        host: dto.host,
        port: Number(dto.port),
        password: dto.password,
        isActive: true,
      },
    });
  }

  async getAccounts() {
    return this.prisma.senderAccount.findMany();
  }

  async setActiveAccount(id: number) {
    await this.prisma.senderAccount.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    return this.prisma.senderAccount.update({
      where: { id_sender: id },
      data: { isActive: true },
    });
  }

  private async getActiveSender() {
    const acc = await this.prisma.senderAccount.findFirst({
      where: { isActive: true },
    });

    if (!acc) throw new NotFoundException('Tidak ada akun email aktif');

    return acc;
  }

  private buildTransporter(acc: any) {
    return nodemailer.createTransport({
      host: acc.host,
      port: acc.port,
      auth: {
        user: acc.email,
        pass: acc.password,
      },
    });
  }

  // ============================================================
  // 3. KIRIM EMAIL — TAMU (SATUAN)
  // ============================================================
  async sendToGuest(body: any) {
    const acc = await this.getActiveSender();
    const transporter = this.buildTransporter(acc);

    try {
      await transporter.sendMail({
        from: acc.email,
        to: body.to,
        subject: body.subject,
        html: body.body,
      });

      await this.prisma.emailSendStatus.create({
        data: {
          status: 1,
          subject: body.subject,
          recipient_email: body.to,
        },
      });

      return { message: 'Email tamu terkirim' };
    } catch (err) {
      await this.prisma.emailSendStatus.create({
        data: {
          status: 0,
          subject: body.subject,
          recipient_email: body.to,
          error_message: String(err),
        },
      });

      throw err;
    }
  }

  // ============================================================
  // 3B. KIRIM EMAIL — TAMU (MASSAL + LAMPIRAN PDF)
  // ============================================================
  async uploadTamu(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File PDF tidak ditemukan.');
    }

    const uploadDir = path.join(process.cwd(), 'uploads/tamu');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const safeName = file.originalname.replace(/\s+/g, '_');
    const fullPath = path.join(uploadDir, safeName);
    fs.writeFileSync(fullPath, file.buffer);

    const saved = await this.prisma.file.create({
      data: {
        file_name: safeName,
        path: fullPath,
        type: 'TAMU_UNDANGAN_PDF',
        userId_user: 1, // TODO: ganti dengan user login
      },
    });

    return {
      message: 'File undangan tamu tersimpan',
      fileId: saved.id_file,
      fileName: saved.file_name,
    };
  }

  async sendTamuMassal(body: any) {
    const { subject, body: htmlBody, fileId, recipients } = body;

    if (!fileId) throw new BadRequestException('fileId wajib diisi.');
    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new BadRequestException('Daftar penerima (recipients) kosong.');
    }

    const file = await this.prisma.file.findUnique({
      where: { id_file: fileId },
    });

    if (!file) {
      throw new NotFoundException('File undangan tamu tidak ditemukan.');
    }

    const acc = await this.getActiveSender();
    const transporter = this.buildTransporter(acc);

    const results: any[] = [];

    for (const email of recipients) {
      if (!email) continue;
      try {
        await transporter.sendMail({
          from: acc.email,
          to: email,
          subject,
          html: htmlBody,
          attachments: [
            {
              filename: file.file_name,
              path: file.path,
            },
          ],
        });

        await this.prisma.emailSendStatus.create({
          data: {
            status: 1,
            subject,
            recipient_email: email,
            fileId: file.id_file,
          },
        });

        results.push({ email, status: 'OK' });
      } catch (err) {
        await this.prisma.emailSendStatus.create({
          data: {
            status: 0,
            subject,
            recipient_email: email,
            fileId: file.id_file,
            error_message: String(err),
          },
        });
        results.push({ email, status: 'FAILED', error: String(err) });
      }
    }

    return { message: 'Pengiriman email tamu massal selesai', results };
  }

  // ============================================================
  // 4. KIRIM EMAIL — MAHASISWA (SATUAN)
  // ============================================================
  async sendToMahasiswaSingle(body: any) {
    const nim = Number(body.nim);
    const peserta = await this.prisma.peserta.findFirst({ where: { nim } });

    if (!peserta) throw new NotFoundException('Peserta tidak ditemukan');

    const acc = await this.getActiveSender();
    const transporter = this.buildTransporter(acc);

    const emailTarget = `${nim}@stis.ac.id`;
    const pdfPath = path.join(process.cwd(), 'uploads/final', `${nim}.pdf`);

    try {
      await transporter.sendMail({
        from: acc.email,
        to: emailTarget,
        subject: body.subject,
        html: body.body,
        attachments: [
          {
            filename: `${nim}.pdf`,
            path: pdfPath,
          },
        ],
      });

      await this.prisma.emailSendStatus.create({
        data: {
          status: 1,
          subject: body.subject,
          recipient_email: emailTarget,
          pesertaId_peserta: peserta.id_peserta,
        },
      });

      return { message: 'Email mahasiswa terkirim' };
    } catch (err) {
      await this.prisma.emailSendStatus.create({
        data: {
          status: 0,
          subject: body.subject,
          recipient_email: emailTarget,
          pesertaId_peserta: peserta.id_peserta,
          error_message: String(err),
        },
      });

      throw err;
    }
  }

  // ============================================================
  // 5. KIRIM EMAIL — MAHASISWA (BULK)
  // ============================================================
  async sendToMahasiswaBulk(body: any) {
    const files = await this.prisma.file.findMany({
      where: { type: 'IMPORT_ZIP_PDF' },
    });

    for (const f of files) {
      if (!f.pesertaId_peserta) continue;

      const peserta = await this.prisma.peserta.findUnique({
        where: { id_peserta: f.pesertaId_peserta },
      });

      if (!peserta || !peserta.nim) continue;

      await this.sendToMahasiswaSingle({
        nim: peserta.nim,
        subject: body.subject,
        body: body.body,
      });
    }

    return { message: 'Bulk email mahasiswa terkirim' };
  }

  // ============================================================
  // 6. LOG EMAIL
  // ============================================================
  async getLogs() {
    return this.prisma.emailSendStatus.findMany({
      orderBy: { waktu_dikirim: 'desc' },
    });
  }

  async retry(id: number) {
    const log = await this.prisma.emailSendStatus.findUnique({
      where: { id_sendStatus: id },
    });

    if (!log) throw new NotFoundException('Log tidak ditemukan');

    // Jika target adalah mahasiswa
    if (log.pesertaId_peserta) {
      const peserta = await this.prisma.peserta.findUnique({
        where: { id_peserta: log.pesertaId_peserta },
      });

      if (!peserta || !peserta.nim) {
        throw new NotFoundException('Peserta tidak ditemukan saat retry');
      }

      return this.sendToMahasiswaSingle({
        nim: peserta.nim,
        subject: log.subject,
        body: log.error_message || 'Pengiriman ulang.',
      });
    }

    // Jika target adalah tamu
    return this.sendToGuest({
      to: log.recipient_email,
      subject: log.subject,
      body: log.error_message || 'Pengiriman ulang.',
    });
  }

  // ============================================================
  // 7. QR KEY
  // ============================================================
  async generateQrKey(body: any) {
    const key = body.key || Math.random().toString(36).slice(2, 10);

    await this.prisma.systemConfig.upsert({
      where: { key_name: 'QR_SECRET_KEY' },
      update: { value: key },
      create: {
        key_name: 'QR_SECRET_KEY',
        value: key,
      },
    });

    return { key };
  }

  async getActiveQrKey() {
    return this.prisma.systemConfig.findUnique({
      where: { key_name: 'QR_SECRET_KEY' },
    });
  }
}
