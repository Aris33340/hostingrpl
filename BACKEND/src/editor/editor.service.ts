// editor.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import PdfEditRequestDto from '../editor/dto/editor.dto';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import path from 'path';

@Injectable()
export class EditorService {
    constructor(@InjectQueue('pdf-render-queue') private pdfQueue: Queue) {}

    async addToQueue(dto: PdfEditRequestDto, userId: number) {
        const outputPath = path.join(`./public/output/rendered/${dto.configuration.projectName}`);
        if (!existsSync(outputPath)) {
            await fs.mkdir(outputPath, { recursive: true })
        }else{
            throw new ConflictException(`Folder "${dto.configuration.projectName}" already exists, gunakan nama project lain`);
        }
        const job = await this.pdfQueue.add('render-job', {
            dto,
            userId
        }, {
            priority: 1, 
            attempts: 3,
            removeOnComplete: true, 
        });

        return {
            message: 'Render job has been queued',
            jobId: job.id,
            queuePosition: await job.getState()
        };
    }
}