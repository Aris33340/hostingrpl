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
    MaxFileSizeValidator,
    ParseFilePipe,
    ParseFilePipeBuilder,
    FileTypeValidator,
    HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileService } from './file.service';
import { join, basename } from 'node:path';
import { createReadStream, existsSync, unlinkSync } from 'node:fs';


@Controller('api/files')
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async uploadFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
            .addMaxSizeValidator({
                maxSize: 20 * 1024 * 1024
            }).build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,   
            })
        )
        
        file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const savedFile = await this.fileService.saveFile(file);
        return savedFile;
    }

    @Get(':id/file')
    async getFile(@Param('id') id: string): Promise<StreamableFile> {
        const fileRecord = await this.fileService.getFileById(Number(id));
        if (!fileRecord) throw new NotFoundException('File not found in database');

        const filePath = join(process.cwd(), fileRecord.path);
        if (!existsSync(filePath)) throw new NotFoundException('File not found on disk');

        const fileName = basename(fileRecord.file_name || filePath);
        const mimeType = this.getMimeType(fileRecord.type);

        const fileStream = createReadStream(filePath);
        const isInline = mimeType.startsWith('image/') || mimeType === 'application/pdf';
        return new StreamableFile(fileStream, {
            type: mimeType,
            disposition: `${isInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(fileName)}"`,
        });
    }

    private getMimeType(type: string): string {
        const map: Record<string, string> = {
            pdf: 'application/pdf',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            txt: 'text/plain',
            json: 'application/json',
        };
        return map[type.toLowerCase()] || 'application/octet-stream';
    }


    @Get('all')
    async getAllFiles() {
        return this.fileService.getAllFiles();
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
        return this.fileService.deleteFileById(Number(id));
    }

}
