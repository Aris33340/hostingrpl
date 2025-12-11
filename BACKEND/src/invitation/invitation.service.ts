import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) { }

  // ==========================================================
  // A. READ DATA
  // ==========================================================

  // [BARU] Method ini dipanggil oleh Controller @Get() tanpa parameter
  // Fungsinya mengambil SEMUA riwayat untuk ditampilkan di tabel utama Frontend
  async getAllHistory() {
    return this.prisma.emailSendStatus.findMany({
      include: {
        // 1. Ambil Nama Folder (Untuk kolom 'Undangan')
        folder: {
          select: { file_name: true }
        },
        // 2. Ambil Nama & Data Peserta
        peserta: {
          include: {
            mahasiswa: true,
            tamu: true
          }
        }
      },
      orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
    });
  }

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

  // Ini untuk melihat detail per folder (opsional, jika nanti ada fiturnya)
  async getHistory(folderId: number) {
    return this.prisma.emailSendStatus.findMany({
      where: { id_folder: folderId },
      include: {
        peserta: {
          include: { mahasiswa: true, tamu: true }
        },
        folder: true // Tambahkan ini biar konsisten
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ==========================================================
  // B. MASUK ANTRIAN (QUEUE LOGIC) - UPDATE SAVE CUSTOM MESSAGE
  // ==========================================================
  async addToQueue(dto: {
    folderId: number;
    recipients: number[];
    subject?: string; // Menerima input subject dari Frontend
    message?: string; // Menerima input message dari Frontend
    manuals?: { email: string; name: string }[]
  }) {
    const { folderId, recipients, subject, message } = dto;

    if (recipients && recipients.length > 0) {
      const dataPeserta = recipients.map((id) => ({
        id_peserta: id,
        id_folder: folderId,
        status: 1, // 1 = PENDING

        // --- SIMPAN INPUT USER KE DATABASE ---
        // Jika user tidak mengisi (undefined/null), database menyimpan null
        subject: subject || null,
        message: message || null
      }));

      // Gunakan skipDuplicates: true agar tidak error jika data persis sama sudah ada
      await this.prisma.emailSendStatus.createMany({
        data: dataPeserta,
        skipDuplicates: true
      });
    }

    return { message: 'Berhasil masuk antrian pengiriman' };
  }

  // ==========================================================
  // C. WORKER OTOMATIS (CRON JOB)
  // ==========================================================
  @Cron(CronExpression.EVERY_10_SECONDS)
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
  // D. PROSES PENGIRIMAN (INTI) - LOGIC CUSTOM MESSAGE
  // ==========================================================
  private async processSingleEmail(logItem: any) {
    let targetEmail = '';
    let targetName = '';

    // --- KONFIGURASI KONTEN (DEFAULT VS USER) ---
    const DEFAULT_SUBJECT = 'Undangan Wisuda STIS';
    const DEFAULT_HTML_BODY = `
      <p>Berikut kami lampirkan dokumen undangan wisuda Anda.</p>
      <p>Mohon simpan dokumen ini sebagai syarat masuk gedung.</p>
    `;

    // 1. Cek Subject: Pakai dari DB jika ada, kalau null pakai Default
    const finalSubject = logItem.subject ? logItem.subject : DEFAULT_SUBJECT;

    // 2. Cek Message: Pakai dari DB jika ada, kalau null pakai Default
    // Note: Kita ganti baris baru (\n) jadi <br> agar rapi di HTML
    const userMessageFormatted = logItem.message
      ? logItem.message.replace(/\n/g, '<br/>')
      : DEFAULT_HTML_BODY;

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

      // 3. Konfigurasi Attachment
      const attachments: { filename: string; path: string }[] = [];

      if (attachmentPath) {
        attachments.push({
          filename: attachmentName,
          path: attachmentPath
        });
      }

      // 4. Kirim Email (HTML DYNAMIC)
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: finalSubject, // <--- Gunakan Subjek Dinamis
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Yth. <b>${targetName}</b>,</p>
            
            <div style="margin: 15px 0;">
              ${userMessageFormatted}
            </div>

            <p>Terima kasih,<br/>Panitia Wisuda STIS</p>
            <hr style="border:0; border-top:1px solid #eee; margin: 20px 0;">
            <small style="color: #888;">Email ini dikirim otomatis oleh sistem.</small>
          </div>
        `,
        attachments: attachments
      });

      // 5. Sukses -> Update Status 2
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