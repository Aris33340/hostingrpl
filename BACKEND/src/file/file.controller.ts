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
    ParseFilePipeBuilder,
    HttpStatus,
    Req,
    Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileService } from './file.service';
import { join, basename } from 'node:path';
import { createReadStream, existsSync, unlinkSync } from 'node:fs';
import { AuthService } from 'src/auth/auth.service';



@Controller('api/files')
export class FileController {
    constructor(private readonly fileService: FileService, private readonly authService: AuthService) { }

    @Get()
    async getAllFiles(@Req() req: any, @Query('type') type: string, @Query('folder') folder:string) {
        try{
            const userId = req.user.sub;
            const files = await this.fileService.getAllFiles(Number(userId), type, folder);
            return files;
        }catch(e){
            throw new BadRequestException('')
        }
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        })
    )
    async uploadFile(@Req() req: any,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(pdf|jpg|jpeg|png|gif)$/i,
                    skipMagicNumbersValidation: true
                })
                .addMaxSizeValidator({
                    maxSize: 20 * 1024 * 1024, // 20 MB
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                }),
        )
        file: Express.Multer.File,
    ) {
        const userId = req.user.sub;
        try {
            if (!file) {
                throw new BadRequestException('No file uploaded');
            }
            const fileUploaded = await this.fileService.saveFile(file, userId);
            return fileUploaded;
        } catch (err) {
            unlinkSync(file.path);
            throw err;
        }
    }

    @Get(':id')
    async getFileById(@Param('id') id: string): Promise<StreamableFile> {
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

    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
        return this.fileService.deleteFileById(Number(id));
    }

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
