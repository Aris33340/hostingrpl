import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Untuk Cron Job
import { MailerModule } from '@nestjs-modules/mailer'; // Untuk Kirim Email
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { PrismaService } from '../prisma/prisma.service'; 

@Module({
  imports: [
    // 1. Aktifkan Penjadwalan (Queue)
    ScheduleModule.forRoot(),

    // 2. Konfigurasi Server Email (SMTP)
    // Ganti user & pass dengan email pengirim yang valid
    MailerModule.forRoot({
      transport: {
        service: 'gmail', // Cara termudah pakai Gmail
        auth: {
          user: process.env.MAIL_USER, // Set di .env: emailanda@gmail.com
          pass: process.env.MAIL_PASS, // Set di .env: App Password
        },
      },
      defaults: {
        from: '"Panitia Wisuda STIS" <no-reply@stis.ac.id>',
      },
    }),
  ],
  controllers: [InvitationController],
  providers: [InvitationService, PrismaService],
})
export class InvitationModule {}