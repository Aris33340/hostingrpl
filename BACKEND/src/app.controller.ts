import { Controller, Get, Param,
  Post,
  Body,
  Put,
  Delete, } from '@nestjs/common';
import { AppService } from './app.service';
import { TamuService } from './tamu/tamu.service';
import { tamu as TamuModel } from 'generated/prisma';
import { user as UserModel } from 'generated/prisma';


@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly TamuService: TamuService, 
    // private readonly UserService: UserService,
  ) {}

  @Get('tamus')
  async tamus(): Promise<TamuModel[]> {
    return this.TamuService.tamus({});
  }
  @Get('users')
  async hello(): Promise<string> {
    return "Hello World!";
  }
  // @Post('login')
  // async login(): Promise<String>{
  //   return "Login berhasil";
  // }
}
