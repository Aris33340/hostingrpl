import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class SettingsService {
    constructor(private prismaService: PrismaService) { }

    async getSettings() {
        return await this.prismaService.settings.findMany()
    }

    async createSettings(data: { key: string, value: string }) {
        
        const res = await this.prismaService.settings.upsert({
            update: {
                key: data.key,
                value: data.value
            },
            create: {
                key: data.key,
                value: data.value
            },
            where: {
                key: data.key
            }
        })
        return res
    }
}