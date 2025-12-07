import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  // ==========================================================
  // A. READ DATA
  // ==========================================================
  
  async getFolders() {
    return this.prisma.file.findMany({
      where: { type: 'FOLDER' },
      include: {
        _count: { select: { children: true } }
      }
    });
  }

  async getFolderDetail(folderId: number) {
    return this.prisma.file.findUnique({
      where: { id_file: folderId }
    });
  }

  async getHistory(folderId: number) {
    return this.prisma.emailSendStatus.findMany({
      where: { id_folder: folderId },
      include: {
        peserta: {
          include: { mahasiswa: true, tamu: true }
        }
        // Catatan: 'file' dihapus dari include karena relasinya sudah tidak ada di schema Anda
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ==========================================================
  // B. MASUK ANTRIAN (QUEUE LOGIC)
  // ==========================================================
  async addToQueue(dto: { 
    folderId: number; 
    recipients: number[]; 
    manuals: { email: string; name: string }[] 
  }) {
    const { folderId, recipients } = dto;

    if (recipients && recipients.length > 0) {
      const dataPeserta = recipients.map((id) => ({
        id_peserta: id,
        id_folder: folderId,
        status: 1, // 1 = PENDING
      }));
      await this.prisma.emailSendStatus.createMany({ data: dataPeserta });
    }

    return { message: 'Berhasil masuk antrian pengiriman' };
  }

  // ==========================================================
  // C. WORKER OTOMATIS (CRON JOB)
  // ==========================================================
  @Cron('*/10 * * * * *') 
  async handleEmailQueue() {
    const queue = await this.prisma.emailSendStatus.findMany({
      where: { status: 1 },
      take: 5,
      include: { 
        peserta: { include: { mahasiswa: true, tamu: true } }
      }
    });

    if (queue.length === 0) return;

    this.logger.log(`[QUEUE] Memproses ${queue.length} email...`);

    for (const item of queue) {
      await this.processSingleEmail(item);
    }
  }

  // ==========================================================
  // D. PROSES PENGIRIMAN (INTI)
  // ==========================================================
  private async processSingleEmail(logItem: any) {
    let targetEmail = '';
    let targetName = '';
    
    // Inisialisasi variabel lampiran
    let attachmentPath: string | null = null;
    let attachmentName = 'Undangan.pdf';

    try {
      // 1. Tentukan Email & Nama
      if (logItem.peserta) {
        if (logItem.peserta.jenis === 'mahasiswa' && logItem.peserta.mahasiswa) {
          targetEmail = logItem.peserta.mahasiswa.email || `${logItem.peserta.mahasiswa.nim}@stis.ac.id`;
          targetName = logItem.peserta.mahasiswa.nama;
        } 
        else if (logItem.peserta.tamu) {
          targetEmail = logItem.peserta.tamu.email;
          targetName = logItem.peserta.tamu.nama;
        }
      }

      if (!targetEmail) throw new Error('Email target kosong/tidak valid');

      // 2. Cari File Personal (PDF Spesifik)
      if (logItem.id_peserta) {
        const personalFile = await this.prisma.file.findFirst({
          where: {
            id_parent: logItem.id_folder,
            id_peserta: logItem.id_peserta,
            type: { contains: 'pdf' } 
          }
        });

        if (personalFile) {
          attachmentPath = personalFile.path;
          attachmentName = personalFile.file_name;
        }
      }

      // 3. Konfigurasi Attachment (FIX: Tipe Data Array)
      const attachments: { filename: string; path: string }[] = [];
      
      if (attachmentPath) {
        attachments.push({
          filename: attachmentName,
          path: attachmentPath 
        });
      }

      // 4. Kirim Email
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: 'Undangan Wisuda STIS',
        html: `
          <p>Yth. <b>${targetName}</b>,</p>
          <p>Berikut kami lampirkan dokumen undangan wisuda Anda.</p>
          <p>Terima kasih,<br/>Panitia Wisuda STIS</p>
        `,
        attachments: attachments
      });

      // 5. Sukses -> Update Status 2
      // FIX: Menggunakan 'errorMessage' yang benar (bukan erroMessage)
      await this.prisma.emailSendStatus.update({
        where: { id_sendStatus: logItem.id_sendStatus },
        data: { 
          status: 2, 
          waktu_dikirim: new Date(),
          errorMessage: null 
        }
      });
      this.logger.log(`[SENT] Berhasil kirim ke: ${targetEmail}`);

    } catch (error: any) { 
      // 6. Gagal -> Update Status 0
      await this.prisma.emailSendStatus.update({
        where: { id_sendStatus: logItem.id_sendStatus },
        data: { 
          status: 0, 
          errorMessage: error.message || 'Unknown Error'
        }
      });
      this.logger.error(`[FAILED] Gagal kirim ke ${targetName}: ${error.message}`);
    }
  }

  // ==========================================================
  // E. RETRY
  // ==========================================================
  async retryEmail(logId: number) {
    return this.prisma.emailSendStatus.update({
      where: { id_sendStatus: logId },
      data: { status: 1, errorMessage: null }
    });
  }
}