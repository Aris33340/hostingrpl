import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './CryptoService';

@Module({
  controllers: [CryptoController],
  providers: [CryptoService]
})
export class CryptoModule {}
