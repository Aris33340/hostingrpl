import { Controller, Get, Post } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Endpoint 1: Ringkasan Atas (Total Peserta & Kehadiran Tamu)
  @Get('summary')
  async getSummary() {
    return this.dashboardService.getSummaryStats();
  }

  // Endpoint 2: Grafik Bar (Mahasiswa per Prodi)
  @Get('chart-prodi')
  async getProdiChart() {
    return this.dashboardService.getProdiStats();
  }

  // Endpoint 3: Statistik Undangan (Email)
  @Get('chart-invitation')
  async getInvitationChart() {
    return this.dashboardService.getInvitationStats();
  }

  // Endpoint 4: SINKRONISASI DATA (Perbaikan Data Kosong)
  // Panggil endpoint ini sekali via Browser/Postman untuk memperbaiki data "0"
  // Cukup buka link ini di browser untuk memperbaiki data
  @Get('sync')
  async syncData() {
    return this.dashboardService.syncData();
  }
}