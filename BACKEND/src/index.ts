import {CryptoService} from './scan/CryptoService'
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../generated/prisma';

let crypto = new CryptoService();
let nim = 1;
let nimEncrypt = crypto.encrypt(nim.toString());
let prisma = new PrismaClient();

console.log(nimEncrypt);
