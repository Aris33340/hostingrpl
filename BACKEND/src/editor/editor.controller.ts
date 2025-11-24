// editor.controller.ts
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { EditorService } from './editor.service';
import type PdfEditRequestDto  from './dto/editor.dto';
import type { Response } from 'express';

@Controller('api/editor')
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

  @Post('render')
  async renderPdf(@Body() dto: PdfEditRequestDto, @Res() res: Response) {
    try {
      const pdfBytes = await this.editorService.renderPdf(dto);
      // res.set({
      //   'Content-Type': 'application/pdf',
      //   'Content-Disposition': `attachment; filename=${dto.pdfFileName.replace('.pdf', '-rendered.pdf')}`,
      // });
      res.status(HttpStatus.OK).send(pdfBytes);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Gagal merender PDF', error: error.message });
    }
  }
}
