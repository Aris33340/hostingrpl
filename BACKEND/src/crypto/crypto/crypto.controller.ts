import { Body, Controller, Post } from '@nestjs/common';
import { CryptoService } from './CryptoService';

@Controller('api/crypto')
export class CryptoController {
    constructor(private cryptoService:CryptoService){}
    @Post('encrypt')
    async encrypt(@Body('data') data:string){
        const result = this.cryptoService.encrypt(data);
        return{message:"success", data:result}
    }
    @Post('decrypt')
    async decrypt(@Body('data') data:string){
        const result = this.cryptoService.decrypt(data);
        return{message:"success", data:result}
    }
}
