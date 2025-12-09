import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Untuk Cron Job
import { MailerModule } from '@nestjs-modules/mailer'; // Untuk Kirim Email
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [InvitationService, PrismaService],
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports:[PrismaModule],
      inject: [PrismaService],
      useFactory: async (prisma: PrismaService) => {
        const mailUser = await prisma.settings.findUnique({
          where: { key: 'MAIL_USER' },
        });

        const mailPass = await prisma.settings.findUnique({
          where: { key: 'MAIL_PASS' },
        });
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: mailUser?.value,
              pass: mailPass?.value,
            },
          },
          defaults: {
            from: '"Panitia Wisuda STIS" <no-reply@stis.ac.id>',
          },
        };
      }
    }),
  ],
  controllers: [InvitationController],
})
export class InvitationModule { }