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
    async renderPDF() {
        try {

        } catch (e) {
            throw e
        }
    }

    async renderPdf(dto: PdfEditRequestDto, userId: number): Promise<any> {
        console.log(JSON.stringify(dto))
        function pxToPt(px: any, cssDPI = 96) {
            return px * (72 / cssDPI); // px * 0.75 jika cssDPI=96
        }

        // konversi pt -> px
        function ptToPx(pt: any, cssDPI = 96) {
            return pt * (cssDPI / 72);
        }
        function normalizeVal(val: any) {
            return Number(val) || 0;
        }
        try {

            const file = await this.prisma.file.findUnique({ where: { id_file: Number(dto.configuration.pdfId) } })

            const pdfBytes = await fs.readFile(`${file?.path}`);
            const mahasiswaList = await this.mhsService.mahasiswas();
            const editablePages = dto.editablePages.map(p => p.pageNumber - 1);
            const outputPath = `./public/output/${dto.configuration.pdfFileName}`;
            for (const mhs of mahasiswaList) {
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const copiedPages = await pdfDoc.copyPages(pdfDoc, editablePages);
                for (const [i, pageConfig] of dto.editablePages.entries()) {
                    const page = copiedPages[i];
                    const { width, height } = page.getSize();
                    for (const element of pageConfig.elements) {
                        const xPos = normalizeVal(element.position.x);
                        const yPosInput = normalizeVal(element.position.y);
                        const yPos = height - yPosInput;
                        const elementHeight = normalizeVal(element.size.height);
                        if (element.type === 'field' || element.type === 'text') {
                            const fieldKey = element.fieldName ?? '';
                            const fontSize = element.textstyle?.fontSize;
                            console.log("fontsize : ",fontSize)
                            const text = (mhs as Record<string, any>)[fieldKey ?? ''] ?? element.content;
                            page.drawText(String(text), {
                                x: xPos,
                                y: yPos - (fontSize ?? 0), // Sesuaikan offset font height jika perlu (misal: yPos - fontSize)
                                size: normalizeVal(element.textstyle?.fontSize) ?? 12,
                                font: await pdfDoc.embedFont(StandardFonts.TimesRoman),
                                color: element.textstyle?.color
                                ? rgb(element.textstyle?.color.r / 255, element.textstyle?.color.g / 255, element.textstyle?.color.b / 255)
                                : rgb(0, 0, 0),
                            });
                        }
                        
                        // 🔹 Tampilkan gambar (misal logo)
                        else if (element.type == 'image' && element.fileId) {
                            console.log(element.type == 'image')
                            const imageBytes = await this.loadImage(element.fileId);
                            let img: any;
                            if (imageBytes.type === 'image/jpeg' || imageBytes.type === 'image/jpg') {
                                img = await pdfDoc.embedJpg(imageBytes.data);
                            } else {
                                img = await pdfDoc.embedPng(imageBytes.data);
                            }
                            
                            page.drawImage(img, {
                                x: xPos,
                                y: yPos - elementHeight, // Koreksi Y agar gambar tidak naik ke atas
                                width: normalizeVal(element.size.width),
                                height: elementHeight,
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

            const renderedFile = await this.prisma.file.create({
                data: {
                    file_name: `rendered-${userId}.pdf`,
                    path: outputPath,
                    type: 'application/pdf',
                    id_user: userId,
                }
            });
            return renderedFile
        } catch (error) {
            console.error(error)
            throw error
        }
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
