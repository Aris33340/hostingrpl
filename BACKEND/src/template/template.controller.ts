import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { TemplateService } from './template.service';

@Controller('api/template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadZip(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!file.originalname.endsWith('.zip')) {
      throw new BadRequestException('File harus ZIP!');
    }

    return this.templateService.saveZip(file);
  }

  @Get('list')
  list() {
    return this.templateService.listTemplates();
  }

  @Delete(':filename')
  delete(@Param('filename') filename: string) {
    return this.templateService.deleteTemplate(filename);
  }
}
