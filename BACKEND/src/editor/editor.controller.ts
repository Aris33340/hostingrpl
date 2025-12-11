import { Controller, Post, Body, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import PdfEditRequestDto from '../editor/dto/editor.dto'; // Sesuaikan path DTO Anda
import { EditorService } from './editor.service';

@Controller('api/editorpdf')
export class TestingEditorController {
    constructor(private readonly editorService: EditorService) { }

    @Post('render')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async renderPdf(@Body() dto: PdfEditRequestDto, @Req() req: any) {
        const userId = req.user.sub;
        const jobStatus = await this.editorService.addToQueue(dto, userId);

        const { message: _, ...details } = jobStatus;
        return {
            message: 'Render job has been successfully queued. Check the worker/processor logs for progress.',
            ...details,
        };
    }
}