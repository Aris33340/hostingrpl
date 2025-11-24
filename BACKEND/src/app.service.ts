import { Injectable } from '@nestjs/common';
import { TamuService } from './tamu/tamu.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
