import { Module } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from "./settings.service";
import { SettingsController } from "./settings.controller";

@Module({
  providers: [PrismaService, SettingsService],
  controllers:[SettingsController],
  exports: [],
})
export class SettingsModule {}
