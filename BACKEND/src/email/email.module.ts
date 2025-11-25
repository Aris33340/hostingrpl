import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Pastikan path benar

@Module({
  imports: [PrismaModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}