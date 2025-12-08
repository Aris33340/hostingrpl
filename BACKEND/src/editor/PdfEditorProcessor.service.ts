// pdf-render.processor.ts
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import * as fs from 'fs/promises';
import * as path from 'path';
import JSZip, { file } from 'jszip';
import PdfEditRequestDto, { ElementProperty, EditablePage, ElementType } from '../editor/dto/editor.dto';
import { QrCodeService } from 'src/qr/qr.service';
import { CryptoService } from 'src/crypto/crypto/CryptoService';
import { existsSync } from 'fs';
import { application } from 'express';
import { ConflictException } from '@nestjs/common';

@Processor('pdf-render-queue')
export class TestingPdfRenderProcessor {
    constructor(private prisma: PrismaService, private qrService: QrCodeService, private cryptoService: CryptoService) { }

    @Process('render-job')
    async handleRender(job: Job<{ dto: PdfEditRequestDto; userId: number }>) {
        const { dto, userId } = job.data;
        console.log(`Processing job ${job.id} for user ${userId}`);

        try {
            const templateFile = await this.prisma.file.findUnique({
                where: { id_file: Number(dto.configuration.pdfId) },
            });
            if (!templateFile) throw new Error('Template file not found');

            const templateBuffer = await fs.readFile(templateFile.path);

            let dataList: any[] = [];

            if (dto.configuration.tableReference === 'mahasiswa') {
                dataList = await this.prisma.mahasiswa.findMany({
                    include: { peserta: { include: { presensis: true } } }
                });
            } else {
                dataList = await this.prisma.tamu.findMany({
                    include: { peserta: { include: { presensis: true } } }
                });
            }

            const staticImagesCache = await this.preloadStaticImages(dto.editablePages);

            let finalOutputPath = '';

            if (dto.configuration.editOption === 'iterateInside') {
                finalOutputPath = await this.processIterateInside(dto, templateBuffer, dataList, staticImagesCache, userId, 0);
            } else {
                finalOutputPath = await this.processIterateOutside(dto, templateBuffer, dataList, staticImagesCache, userId, 0);
            }

            console.log(`Job ${job.id} completed. Saved at ${finalOutputPath}`);
            return { status: 'success', path: finalOutputPath };

        } catch (error) {
            console.error(`Job ${job.id} failed:`, error);
            throw error;
        }
    }

    private safe = (s: any) => (String(s ?? "")).replace(/[\/\\:*?"<>|]/g, "_");

    private async processIterateOutside(
        dto: PdfEditRequestDto,
        templateBuffer: Buffer,
        dataList: any[],
        imageCache: Map<string, Buffer>,
        userId: number,
        folderParentId: number
    ): Promise<string> {
        const zip = new JSZip();
        const templatePdf = await PDFDocument.load(templateBuffer);

        const outputPath = path.join(`./public/output/rendered/${dto.configuration.projectName}`);

        const folderDB = await this.prisma.file.create({
            data:{
                file_name:dto.configuration.projectName,
                path:outputPath,
                type:'FOLDER',
                id_user:userId,
            }
        })
        const pagesConfig = dto.editablePages;

        const totalPages = templatePdf.getPageCount()
        const pageIndices = Array.from({ length: totalPages }, (_, i) => i);
        for (const row of dataList) {
            const pdfDoc = await PDFDocument.create();
            const fontMap = await this.embedStandardFonts(pdfDoc);
            const processPageElements = async (targetPage: any, elements: ElementProperty[], rowData: any) => {
                const { height } = targetPage.getSize();
                for (const el of elements) {
                    await this.drawElement(targetPage, el, rowData, fontMap, pdfDoc, imageCache, height);
                }
            };
            for (const pageNum of pageIndices) {
                const editable = pagesConfig.find(e => e.pageNumber - 1 === pageNum);
                const [pageCopy] = await pdfDoc.copyPages(templatePdf, [pageNum]);
                if (editable) {
                    await processPageElements(pageCopy, editable.elements, row);
                }
                pdfDoc.addPage(pageCopy);
            }
            const pdfBytes = await pdfDoc.save()
            const fileName = `${this.safe(dto.configuration.projectName)}-${this.safe(row.nim ?? row.nama)}-${Date.now()}.pdf`;
            const filePath = path.join(outputPath, fileName)
            if (dto.configuration.renderOption.saveToDb) {
                await fs.writeFile(filePath, pdfBytes);
                await this.prisma.file.create({
                    data:{
                        file_name:fileName,
                        path:filePath,
                        type:'application/pdf',
                        id_parent:folderDB.id_file,
                        id_user:userId,
                        id_peserta:row.peserta[0].id_peserta
                    }
                })
            }
            
            if (dto.configuration.renderOption.asZip) {
                zip.file(fileName, pdfBytes)
            }
        }
        if (dto.configuration.renderOption.asZip) {
            const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
            await fs.writeFile(outputPath, zipContent)
        }
        return outputPath;
    }

    private async processIterateInside(
        dto: PdfEditRequestDto,
        templateBuffer: Buffer,
        dataList: any[],
        imageCache: Map<string, Buffer>,
        userId: number,
        id_parent: number
    ): Promise<string> {
        const zip = new JSZip();

        const templatePdf = await PDFDocument.load(templateBuffer);
        const pdfDoc = await PDFDocument.create();
        const pageConfigs = dto.editablePages;
        const fontMap = await this.embedStandardFonts(pdfDoc)

        const outputPath = path.join(`./public/output/rendered/${dto.configuration.projectName}`);

        const folderDB = await this.prisma.file.create({
            data:{
                file_name:dto.configuration.projectName,
                path:outputPath,
                type:'FOLDER',
                id_user:userId,
            }
        })

        const totalPages = templatePdf.getPageCount()
        const pageIndices = Array.from({ length: totalPages }, (_, i) => i);
        const copiedPages = await (pdfDoc).copyPages(templatePdf, pageIndices)

        const processPageElements = async (targetPage: any, elements: ElementProperty[], rowData: any) => {
            const { height } = targetPage.getSize();
            for (const el of elements) {
                await this.drawElement(targetPage, el, rowData, fontMap, pdfDoc, imageCache, height);
            }
        };

        for (const pageNum of pageIndices) {
            const startEdit = pageConfigs.find(e => e.pageNumber-1 === pageNum)
            if (startEdit) {
                for (const [index, row] of dataList.entries()) {
                    for (const pageConfig of pageConfigs) {
                        const [page] = await (pdfDoc).copyPages(templatePdf, [pageConfig.pageNumber-1])
                        await processPageElements(page, pageConfig.elements, row)
                        pdfDoc.addPage(page)
                    }
                }
            } else {
                const copiedPage = copiedPages[pageNum]
                pdfDoc.addPage(copiedPage)
            }
        }

        const pdfBytes = await pdfDoc.save()
        const fileName = `${this.safe(dto.configuration.projectName)}-${Date.now()}.pdf`;
        const filePath = path.join(outputPath, fileName)
        if (dto.configuration.renderOption.saveToDb) {
            await fs.writeFile(filePath, pdfBytes);
            await this.prisma.file.create({
                data:{
                    file_name:fileName,
                    path:filePath,
                    type:'application/pdf',
                    id_parent:folderDB.id_file,
                    id_user:userId,
                }
            })
        }
        if (dto.configuration.renderOption.asZip) {
            zip.file(fileName, pdfBytes)
        }

        return outputPath
    }

    private async drawElement(
        page: any,
        el: ElementProperty,
        data: any,
        fontMap: any,
        doc: PDFDocument,
        imageCache: Map<string, Buffer>,
        pageHeight: number
    ) {
        const xPos = el.position.x;
        const yPos = pageHeight - el.position.y;

        if (el.type === ElementType.TEXT || el.type === ElementType.FIELD) {
            let textToRender = el.content || '';
            if (el.type === ElementType.FIELD && el.fieldName) {
                textToRender = this.resolveFieldData(data, el.fieldName);
                console.log("texttorender",textToRender)
                console.log("data",data)
                console.log("fieldName",el.fieldName)
            }
            const font = el.textstyle?.fontFamily === 'Helvetica' ? fontMap.Helvetica : fontMap.Times;
            const size = el.textstyle?.fontSize || 12;

            page.drawText(String(textToRender), {
                x: xPos,
                y: yPos - size,
                size: size,
                font: font,
                color: el.textstyle?.color
                    ? rgb(el.textstyle.color.r / 255, el.textstyle.color.g / 255, el.textstyle.color.b / 255)
                    : rgb(0, 0, 0),
                opacity: el.opacity,
                rotate: el.rotation ? { type: 'degrees', angle: el.rotation } : undefined
            });

        } else if (el.type === ElementType.IMAGE && el.fileId) {
            const imgBuffer = imageCache.get(String(el.fileId));
            if (imgBuffer) {
                const img = await this.embedImageAuto(doc, imgBuffer);
                page.drawImage(img, {
                    x: xPos,
                    y: yPos - el.size.height,
                    width: el.size.width,
                    height: el.size.height,
                    opacity: el.opacity
                });
            }

        } else if (el.type === ElementType.QR) {

            const idPresensi = data.peserta?.[0]?.presensis?.[0]?.id_presensi;

            if (idPresensi) {
                try {
                    const encryptedData = this.cryptoService.encrypt(String(idPresensi));

                    const qrBuffer = await this.qrService.createQR(encryptedData);

                    const qrImage = await doc.embedPng(qrBuffer);

                    page.drawImage(qrImage, {
                        x: xPos,
                        y: yPos - el.size.height,
                        width: el.size.width,
                        height: el.size.height
                    });
                } catch (err) {
                    console.error(`Gagal generate QR untuk ID ${idPresensi}:`, err);
                }
            } else {
                console.warn('Data ID Presensi tidak ditemukan untuk QR Code');
            }
        }
    }

    private resolveFieldData(data: any, path: string): string {
        
        return data[path] ?? '';
    }

    private async preloadStaticImages(pages: EditablePage[]): Promise<Map<string, Buffer>> {
        const map = new Map<string, Buffer>();
        for (const p of pages) {
            for (const el of p.elements) {
                if (el.type === ElementType.IMAGE && el.fileId && !map.has(String(el.fileId))) {
                    const file = await this.prisma.file.findUnique({ where: { id_file: Number(el.fileId) } });
                    if (file) {
                        const buf = await fs.readFile(file.path);
                        map.set(String(el.fileId), buf);
                    }
                }
            }
        }
        return map;
    }

    private async embedStandardFonts(doc: PDFDocument) {
        return {
            TimesRoman: await doc.embedFont(StandardFonts.TimesRoman),
            TimesRomanBold: await doc.embedFont(StandardFonts.TimesRomanBold),
            TimesRomanItalic: await doc.embedFont(StandardFonts.TimesRomanItalic),
            TimesRomanBoldItalic: await doc.embedFont(StandardFonts.TimesRomanBoldItalic),
            Helvetica: await doc.embedFont(StandardFonts.Helvetica),
            HelveticaBold: await doc.embedFont(StandardFonts.HelveticaBold),
            HelveticaOblique: await doc.embedFont(StandardFonts.HelveticaOblique),
            HelveticaBoldOblique: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
            Courier: await doc.embedFont(StandardFonts.Courier),
            CourierBold: await doc.embedFont(StandardFonts.CourierBold),
            CourierOblique: await doc.embedFont(StandardFonts.CourierOblique),
            CourierBoldOblique: await doc.embedFont(StandardFonts.CourierBoldOblique),
        };
    }

    private async embedImageAuto(doc: PDFDocument, buffer: Buffer) {
        try {
            return await doc.embedJpg(buffer);
        } catch (e) {
            return await doc.embedPng(buffer);
        }
    }
}