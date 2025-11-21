import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { writeFileSync, existsSync } from 'fs';
import * as fs from 'fs/promises';
import PdfEditRequestDto from './dto/editor.dto';
import { MahasiswaService } from 'src/mahasiswa/mahasiswa.service';

@Injectable()
export class EditorService {
    constructor(private readonly mhsService: MahasiswaService) { }
    async renderPdf(dto: PdfEditRequestDto): Promise<String> {

        // const pdfBytes = await fs.readFile(`./public/uploads/${dto.pdfFileName}`);


        const mahasiswaList = await this.mhsService.mahasiswas();

        const editablePages = dto.editablePages.map(p => p.pageNumber - 1);
        console.log('Halaman yang dapat diedit:', editablePages);

        for (const mhs of mahasiswaList) {
            const pdfDoc = await PDFDocument.create();
            pdfDoc.addPage([500, 700]);
            const copiedPages = await pdfDoc.copyPages(pdfDoc, editablePages);
            for (const [i, pageConfig] of dto.editablePages.entries()) {
                const page = copiedPages[i];
                for (const element of pageConfig.elements) {
                    // 🔹 Tulis field teks
                    if (element.type === 'field' || element.type === 'text') {
                        const fieldKey = element.fieldName ?? element.content;
                        const text = (mhs as Record<string, any>)[fieldKey ?? ''] ?? '';
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
                        let img;
                        if (imageBytes.type === 'jpg') {
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
            const outputPath = `./public/output/${mhs.nim}.pdf`;
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

        return 'success';
    }

    private async loadImage(
        fileId: string,
    ): Promise<{ data: Uint8Array; type: 'png' | 'jpg' }> {
        const pngPath = `./public/uploads/${fileId}.png`;
        const jpgPath = `./public/uploads/${fileId}.jpg`;
        const jpegPath = `./public/uploads/${fileId}.jpeg`;

        let filePath = '';
        let fileType: 'png' | 'jpg' | null = null;

        if (existsSync(pngPath)) {
            filePath = pngPath;
            fileType = 'png';
        } else if (existsSync(jpgPath)) {
            filePath = jpgPath;
            fileType = 'jpg';
        } else if (existsSync(jpegPath)) {
            filePath = jpegPath;
            fileType = 'jpg';
        }

        if (!filePath || !fileType) {
            throw new Error(`File gambar tidak ditemukan untuk fileId: ${fileId}`);
        }

        const imageBuffer = await fs.readFile(filePath);
        return { data: imageBuffer, type: fileType };
    }
}
