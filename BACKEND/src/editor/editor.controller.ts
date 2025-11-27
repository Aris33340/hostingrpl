// editor.controller.ts
import { Controller, Post, Body, Res, HttpStatus, Req, BadRequestException, ConflictException, HttpException } from '@nestjs/common';
import { EditorService } from './editor.service';
import type PdfEditRequestDto from './dto/editor.dto';
import type { Response } from 'express';
import { Prisma } from '@prisma/client';

@Controller('api/editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) { }
  @Post('render')
  async renderPdf(@Body() dto: PdfEditRequestDto, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const renderStatus = await this.editorService.renderPdf(dto, Number(userId));
      return renderStatus
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('Nama File Harus Berbeda', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message,HttpStatus.BAD_REQUEST)
    }
  }
}
