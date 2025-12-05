import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { InvitationService } from './invitation.service';

@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  // 1. Ambil Daftar Folder Undangan
  // GET /invitation/folders
  @Get('folders')
  async getFolders() {
    return this.invitationService.getFolders();
  }

  // 2. Ambil Detail Satu Folder
  // GET /invitation/folders/1
  @Get('folders/:id')
  async getFolderDetail(@Param('id') id: string) {
    return this.invitationService.getFolderDetail(+id);
  }

  // 3. Tombol "Kirim" (Masuk ke Antrian)
  // POST /invitation/queue
  // Body: { "folderId": 1, "recipients": [10, 11, 12], "manuals": [] }
  @Post('queue')
  async addToQueue(@Body() body: { 
    folderId: number; 
    recipients: number[]; 
    manuals: { email: string; name: string }[] 
  }) {
    return this.invitationService.addToQueue(body);
  }

  // 4. Ambil Riwayat Pengiriman
  // GET /invitation/history/1
  @Get('history/:folderId')
  async getHistory(@Param('folderId') folderId: string) {
    return this.invitationService.getHistory(+folderId);
  }

  // 5. Tombol "Kirim Ulang" (Retry)
  // PUT /invitation/retry/50
  @Put('retry/:logId')
  async retry(@Param('logId') logId: string) {
    return this.invitationService.retryEmail(+logId);
  }
}