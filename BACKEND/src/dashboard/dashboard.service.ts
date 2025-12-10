import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // =================================================================
  // 1. GET SUMMARY (Ringkasan Atas & Scanner Bar Chart)
  // =================================================================
  async getSummaryStats() {
    // A. Hitung Total Peserta Terdaftar (Langsung dari Tabel Master)
    // Ini menjamin angka "Total Peserta" selalu muncul jika data sudah diupload
    const [totalMhs, totalTamu] = await Promise.all([
      this.prisma.mahasiswa.count(), 
      this.prisma.tamu.count(),
    ]);

    // B. Hitung Hasil Scanner (Kehadiran: Status = 1)
    // Dipisahkan untuk kebutuhan Grafik Batang (Bar Chart)
    const [mhsHadir, tamuHadir] = await Promise.all([
      this.prisma.presensi.count({
        where: {
          status: 1, // 1 = Hadir
          peserta: { jenis: 'mahasiswa' }
        }
      }),
      this.prisma.presensi.count({
        where: {
          status: 1, // 1 = Hadir
          peserta: { jenis: 'tamu' }
        }
      })
    ]);

    return {
      // Total gabungan untuk Donut Chart Utama
      totalPeserta: totalMhs + totalTamu,
      
      // Detail Breakdown
      breakdownPeserta: {
        mahasiswa: totalMhs,
        tamu: totalTamu
      },
      
      // Data Khusus untuk Grafik Batang Scanner (Tamu vs Mahasiswa)
      attendance: {
        mahasiswa: mhsHadir,
        tamu: tamuHadir
      },
      
      // Data Ringkasan Kecil (Card Kehadiran Tamu)
      kehadiranTamu: {
        total: totalTamu,
        hadir: tamuHadir,
        belum: totalTamu - tamuHadir 
      }
    };
  }

  // =================================================================
  // 2. GET PRODI STATS (Grafik Batang Per Prodi)
  // =================================================================
  async getProdiStats() {
    // Ambil data Mahasiswa beserta relasi ke Presensi
    const rawData = await this.prisma.mahasiswa.findMany({
      include: {
        peserta: {
          include: {
            presensis: true // Pastikan nama relasi sesuai dengan schema.prisma (jamak/tunggal)
          }
        }
      }
    });

    const stats = {};

    rawData.forEach(mhs => {
        const prodi = mhs.prodi || 'Lainnya';
        
        // Inisialisasi object jika prodi belum ada di list
        if (!stats[prodi]) {
            stats[prodi] = { prodi, total: 0, hadirWisuda: 0, hadirGladi: 0 };
        }
        
        stats[prodi].total++;
        
        // --- LOGIC AMAN (ANTI ERROR TYPESCRIPT) ---
        // Menggunakan casting 'any' untuk menghindari error merah jika properti presensis tidak terbaca otomatis
        const mhsAny: any = mhs; 
        
        // Ambil peserta pertama (jika ada)
        const peserta = mhsAny.peserta && mhsAny.peserta.length > 0 ? mhsAny.peserta[0] : null;
        
        // Cek status kehadiran
        if (peserta && peserta.presensis && peserta.presensis.length > 0) {
            // Asumsi: Status 1 adalah Hadir Wisuda
            if (peserta.presensis[0].status === 1) {
                stats[prodi].hadirWisuda++;
            }
        }
    });

    return Object.values(stats); 
  }

  // =================================================================
  // 3. GET INVITATION STATS (Grafik Batang Undangan Terkirim)
  // =================================================================
  async getInvitationStats() {
    // Menghitung email yang sukses terkirim (Status = 2)
    // Dipisahkan antara Mahasiswa dan Tamu untuk kebutuhan Grafik Batang
    const [mhsSukses, tamuSukses] = await Promise.all([
        this.prisma.emailSendStatus.count({
            where: { 
                status: 2, // 2 = Sukses
                peserta: { jenis: 'mahasiswa' }
            }
        }),
        this.prisma.emailSendStatus.count({
            where: { 
                status: 2, // 2 = Sukses
                peserta: { jenis: 'tamu' }
            }
        })
    ]);

    return {
        mahasiswa: {
            terkirim: mhsSukses,
        },
        tamu: {
            terkirim: tamuSukses,
        }
    };
  }

  // =================================================================
  // 4. SYNC DATA (Stub / Bypass)
  // =================================================================
  async syncData() {
    // Karena kita sudah pakai hitung langsung (Direct Count) di getSummaryStats,
    // fungsi ini tidak terlalu krusial lagi untuk tampilan, tapi dibiarkan return OK
    // agar endpoint tidak error 404 jika dipanggil.
    return { status: 'OK', message: 'Data synced (Direct Count Mode Active)' };
  }
}