import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Param,
    StreamableFile,
    Get,
    Delete,
    BadRequestException,
    NotFoundException,
    HttpStatus,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
    import { extname, join as pathJoin, basename } from 'path';
import { FileService } from './file.service';
import { createReadStream, existsSync } from 'fs';

@Controller('api/files')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    // ===============================
    // GET ALL FILES
    // ===============================
    @Get()
    async getAllFiles() {
        return this.fileService.getAllFiles();
    }

    // ===============================
    // UPLOAD PDF (ENDPOINT LAMA)
    // ===============================
    @Post(':userId')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(
                        null,
                        `${file.fieldname}-${uniqueSuffix}${extname(
                            file.originalname,
                        )}`,
                    );
                },
            }),
        }),
    )
    async uploadFile(
        @Param('userId') userId: string,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(pdf)$/i, // PDF saja
                    skipMagicNumbersValidation: true,
                })
                .addMaxSizeValidator({ maxSize: 20 * 1024 * 1024 }) // 20MB
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
        )
        file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('No file uploaded');
        return this.fileService.saveFile(file, Number(userId));
    }

    // =============================
    // UPLOAD ZIP TEMPLATE MAHASISWA
    // =============================
    @Post("zip/:userId")
    @UseInterceptors(FileInterceptor("file"))
    async uploadZip(
    @Param("userId") userId: string,
    @UploadedFile(
        new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: "zip" })
        ],
        })
    )
    file: Express.Multer.File,
    ) {
    return this.fileService.saveZip(file, Number(userId));
    }

    async uploadZipTemplate(
    @Param('userId') userId: string,
    @UploadedFile(
        new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
            new FileTypeValidator({ fileType: 'zip' })
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    file: Express.Multer.File
    ) {
    if (!file) throw new BadRequestException('ZIP file is required');

    // SIMPAN RECORD KE DATABASE (jika ada)
    const result = await this.fileService.saveZip(file, Number(userId));

    return {
        message: 'ZIP template uploaded successfully',
        file: result
    };
    }

    // ===============================
    // GET FILE BY ID
    // ===============================
    @Get(':id')
    async getFile(@Param('id') id: string): Promise<StreamableFile> {
        const fileRecord = await this.fileService.getFileById(Number(id));
        if (!fileRecord) throw new NotFoundException('File not found in database');

        const filePath = pathJoin(process.cwd(), fileRecord.path);
        if (!existsSync(filePath)) throw new NotFoundException('File not found on disk');

        const fileName = basename(fileRecord.file_name || filePath);
        const mimeType = this.getMimeType(fileRecord.type);

        const fileStream = createReadStream(filePath);
        const inline = mimeType.startsWith('image/') || mimeType === 'application/pdf';

        return new StreamableFile(fileStream, {
            type: mimeType,
            disposition: `${inline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(
                fileName,
            )}"`,
        });
    }

    // ===============================
    // DELETE FILE
    // ===============================
    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
        return this.fileService.deleteFileById(Number(id));
    }

    // ===============================
    // MIME MAP
    // ===============================
    private getMimeType(type: string): string {
        const map: Record<string, string> = {
            pdf: 'application/pdf',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            txt: 'text/plain',
            json: 'application/json',
            zip: 'application/zip',
        };
        return map[type.toLowerCase()] || 'application/octet-stream';
    }
}
