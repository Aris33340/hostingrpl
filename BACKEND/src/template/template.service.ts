import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplateService {

  templateDir = join(process.cwd(), 'public', 'templates');

  constructor() {
    if (!existsSync(this.templateDir)) {
      mkdirSync(this.templateDir, { recursive: true });
    }
  }

  saveZip(file: Express.Multer.File) {
    const filePath = join(this.templateDir, file.originalname);
    writeFileSync(filePath, file.buffer);
    return { filename: file.originalname, path: filePath };
  }

  listTemplates() {
    return readdirSync(this.templateDir).map(filename => ({
      filename,
    }));
  }

  deleteTemplate(filename: string) {
    const path = join(this.templateDir, filename);
    if (existsSync(path)) unlinkSync(path);
    return { deleted: true };
  }
}
