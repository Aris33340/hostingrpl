import { Controller, Get, Param,
  Post,
  Body,
  Put,
  Delete, } from '@nestjs/common';
import { AppService } from './app.service';
import { tamu as TamuModel } from '@prisma/client';
import { user as UserModel } from '@prisma/client';


@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly UserService: UserService,
  ) {}

  @Get('users')
  async hello(): Promise<string> {
    return "Hello World!";
  }
  // @Post('login')
  // async login(): Promise<String>{
  //   return "Login berhasil";
  // }
}
