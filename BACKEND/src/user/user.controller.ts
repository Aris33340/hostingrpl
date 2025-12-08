import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Get,
    HttpStatus,
    UseGuards,
    BadRequestException,
    StreamableFile,
    Delete,
    Param,
    Put,
    Body,
    ParseIntPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { basename } from 'path';


@ApiTags('Admin User Management')
@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiOperation({ summary: 'Mendapatkan daftar semua pengguna (Admin Only)' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Berhasil mendapatkan daftar pengguna.' })
    async findAll() {
        return this.userService.findAll();
    }

    @Get('template')
    @ApiOperation({ summary: 'Mengunduh template Excel statis untuk pendaftaran massal' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Berhasil mengunduh template Excel.' })
    async getTemplate(): Promise<StreamableFile> {
        const { path, readStream } = await this.userService.getStaticExcelTemplate();

        const fileName = basename(path);
        return new StreamableFile(readStream, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: `attachment; filename="${fileName}"`,
        });
    }

    @Post('register/batch')
    @ApiOperation({ summary: 'Pendaftaran pengguna massal dari file Excel (Admin Only)' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Pendaftaran pengguna massal berhasil.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'File atau data dalam file tidak valid.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Email/Username sudah terdaftar.' })
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 1024 * 1024 * 5 }
    }))
    async registerBatch(@UploadedFile() file: Express.Multer.File) {
        if (!file || file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            throw new BadRequestException('Mohon unggah file Excel (.xlsx) yang valid.');
        }

        const result = await this.userService.registerBatch(file.buffer);

        return {
            statusCode: HttpStatus.CREATED,
            message: result,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user (Admin Only)' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        // body may contain: username, email, password, role
        const updated = await this.userService.updateUser(id, body);
        return {
            statusCode: HttpStatus.OK,
            message: 'User berhasil diupdate',
            data: updated
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Hapus user (Admin Only)' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.userService.removeUser(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'User berhasil dihapus'
        };
    }
}