import { Injectable, NotFoundException } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { writeFileSync, existsSync } from 'fs';
import * as fs from 'fs/promises';
import PdfEditRequestDto from './dto/editor.dto';
import { MahasiswaService } from 'src/mahasiswa/mahasiswa.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EditorService {
    constructor(private readonly mhsService: MahasiswaService, private prisma: PrismaService) { }
    async renderPdf(dto: PdfEditRequestDto, userId: number): Promise<any> {


        const file = await this.prisma.file.findUnique({ where: { id_file: Number(dto.configuration.pdfId) } })

        const pdfBytes = await fs.readFile(`${file?.path}`);
        const mahasiswaList = await this.mhsService.mahasiswas();

        const editablePages = dto.editablePages.map(p => p.pageNumber - 1);

        const outputPath = `./public/output/hasilujicoba.pdf`;
        for (const mhs of mahasiswaList) {
            const pdfDoc = await PDFDocument.load(pdfBytes);
            pdfDoc.addPage([500, 700]);

            const copiedPages = await pdfDoc.copyPages(pdfDoc, editablePages);
            for (const [i, pageConfig] of dto.editablePages.entries()) {
                const page = copiedPages[i];
                for (const element of pageConfig.elements) {
                    if (element.type === 'field' || element.type === 'text') {
                        const fieldKey = element.fieldName ?? '';
                        const text = (mhs as Record<string, any>)[fieldKey ?? ''] ?? element.content;
                        page.drawText(String(text), {
                            x: element.position.x,
                            y: element.position.y,
                            size: element.style?.fontSize ?? 12,
                            font: await pdfDoc.embedFont(
                                element.style?.fontFamily || StandardFonts.TimesRoman,
                            ),
                            color: element.style?.color
                                ? rgb(
                                    element.style.color.r / 255,
                                    element.style.color.g / 255,
                                    element.style.color.b / 255,
                                )
                                : rgb(0, 0, 0),
                        });
                    }

                    // 🔹 Tampilkan gambar (misal logo)
                    else if (element.type === 'image' && element.fileId) {
                        const imageBytes = await this.loadImage(element.fileId);
                        let img: any;
                        if (imageBytes.type === 'image/jpeg') {
                            img = await pdfDoc.embedJpg(imageBytes.data);
                        } else {
                            img = await pdfDoc.embedPng(imageBytes.data);
                        }

                        page.drawImage(img, {
                            x: element.position.x,
                            y: element.position.y,
                            width: element.size.width,
                            height: element.size.height,
                            opacity: element.opacity ?? 1,
                        });
                    }
                }
                pdfDoc.insertPage(editablePages[i], page);
                pdfDoc.removePage(editablePages[i] + 1);
            }
            pdfDoc.insertPage(0, copiedPages[0]);
            pdfDoc.removePage(1);

            const pdfBytesOut = await pdfDoc.save();
            writeFileSync(outputPath, pdfBytesOut);
        }



        // // for (const mahasiswa of mahasiswaList) {
        // //     for (const [i,pageConfig] of dto.editablePages.entries()) {
        // //         const page = copiedPages[i];

        // //         pdfDoc.insertPage(pageConfig.pageNumber-1,page);
        // //         pdfDoc.removePage(pageConfig.pageNumber);
        // //     }

        // // }


        // if (dto.renderOption.saveToDb) {
        //     console.log('PDF disiapkan untuk disimpan ke database...');
        // } else {
        //     const outputPath = `./public/output/${dto.pdfFileName.replace(
        //         '.pdf',
        //         '-rendered.pdf',
        //     )}`;
        //     writeFileSync(outputPath, pdfBytesOut);
        //     console.log(`✅ PDF berhasil disimpan ke: ${outputPath}`);
        // }
        return this.prisma.file.create({
            data: {
                file_name: `rendered-${userId}.pdf`,
                path: outputPath,
                type: 'application/pdf',
                id_user: userId,
            }
        });
    }

    private async loadImage(
        fileId: string,
    ): Promise<{ data: Uint8Array; type: string }> {
        const path = await this.prisma.file.findUnique({ where: { id_file: Number(fileId) } })
        // const pngPath = `./public/uploads/${fileId}.png`;
        // const jpgPath = `./public/uploads/${fileId}.jpg`;
        // const jpegPath = `./public/uploads/${fileId}.jpeg`;

        // let filePath = '';
        // let fileType: 'png' | 'jpg' | null = null;

        // if (existsSync(pngPath)) {
        //     filePath = pngPath;
        //     fileType = 'png';
        // } else if (existsSync(jpgPath)) {
        //     filePath = jpgPath;
        //     fileType = 'jpg';
        // } else if (existsSync(jpegPath)) {
        //     filePath = jpegPath;
        //     fileType = 'jpg';
        // }

        // if (!filePath || !fileType) {
        //     throw new Error(`File gambar tidak ditemukan untuk fileId: ${fileId}`);
        // }
        const filePath = path?.path;
        if (!filePath) {
            throw new NotFoundException;
        }

        const imageBuffer = await fs.readFile(filePath);
        return { data: imageBuffer, type: path.type };
    }
}
