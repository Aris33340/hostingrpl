import { Controller, Post, Body, HttpException, HttpStatus, Get, InternalServerErrorException, Req } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { QrCodeService } from "./qr.service";
import type QRDTO from "./dto/qroptions.dto";
import * as fs from "fs";

@Controller('api/qr')
export class QRcontroller {
    constructor(private prismaService: PrismaService, private qrCodeService: QrCodeService) { }
    @Post('generate-qr')
    async qreateQr(@Body('data') data: string, @Body('config') qrDto?: QRDTO) {
        try {
            const pdfBuffer = await this.qrCodeService.createQR(data,qrDto);
            if (!fs.existsSync(`./public/qr-generate/`)) {
                fs.mkdirSync(`./public/qr-generate/`, { recursive: true });
            }
            fs.writeFileSync(`./public/qr-generate/ujicobaa.png`, pdfBuffer);
            return 'berhasil'
        } catch (error) {
            throw new HttpException(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('')
    async generateQRcode(@Req() req: any) {
        try {
            const qrBuffers: any[] = await this.qrCodeService.generateQRmahasiswa();
            if (!fs.existsSync(`./public/qr-generate/ujicoba`)) {
                fs.mkdirSync(`./public/qr-generate/ujicoba`, { recursive: true });
            }
            const userId = req.user.sub;
            qrBuffers.forEach(async data => {
                const fileName = `${data.nim}.png`
                const path = `public/qr-generate/ujicoba/${fileName}`
                fs.writeFileSync(path, data.qrBuffer);
                await this.prismaService.file.create({
                    data: {
                        file_name: fileName,
                        path: path,
                        type: 'image/png',
                        id_peserta: Number(data.id_peserta),
                        id_user:userId
                    }
                })
            })
            // return await this.prismaService.file.create({
            //     data:{
            //         file_name:'test',
            //         path:'test',
            //         type:'test',
            //         id_peserta:1,
            //         id_user:1
            //     }
            // })
            // return 'success'
        } catch (e) {
            throw new InternalServerErrorException(e.message)
        }
    }

}
