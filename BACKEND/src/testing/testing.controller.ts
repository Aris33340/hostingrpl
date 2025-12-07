import { Controller, Post, Body, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import PdfEditRequestDto from '../editor/dto/editor.dto'; // Sesuaikan path DTO Anda
import { TestingEditorService } from './TestingEditor.service';

@Controller('api/editorpdf')
export class TestingEditorController {
    // Asumsi EditorService sudah di-inject dan memiliki method addToQueue
    constructor(private readonly editorService: TestingEditorService) { }

    @Post('render')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async renderPdf(@Body() dto: PdfEditRequestDto, @Req() req: any) {
        const userId = req.user.sub;
        console.log('entry')
        // 1. Panggil service untuk mendapatkan status job (jobId, queuePosition, dll)
        const jobStatus = await this.editorService.addToQueue(dto, userId);
        console.log('complete queue')

        // 2. Destructure jobStatus: Ambil semua properti kecuali 'message'
        //    (Menggunakan 'message: _' adalah cara untuk mengambil properti 'message' 
        //     dan menamainya '_' yang tidak akan kita gunakan, sehingga properti lainnya
        //     disimpan di variabel 'details'.)
        const { message: _, ...details } = jobStatus;

        // 3. Kembalikan objek, menggunakan 'message' yang lebih deskriptif dari controller
        //    dan menyebarkan 'details' (jobId, queuePosition)
        return {
            message: 'Render job has been successfully queued. Check the worker/processor logs for progress.',
            ...details, // Hanya menyebarkan jobId, queuePosition, dll.
        };
    }
}