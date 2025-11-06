import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from '../../node_modules/bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { $Enums as Role} from 'generated/prisma/client';

@Injectable()
export class AuthService {
    // Get the secret KEY
    private readonly jwtSecret: string;
    constructor(private prisma: PrismaService, private configService: ConfigService) {
        this.jwtSecret = this.configService.get<string>('SECRET_KEY') ?? 'supersecretkey';
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async generateToken(userId: number): Promise<string> {
        return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '1H' });
    }

    async register(username: string, email: string, password: string): Promise<string> {
        const hashedPassword = await this.hashPassword(password);
        const user = await this.prisma.user.create({
            data: {
                username,
                email: email,
                password: hashedPassword,
                role: Role.userRole.SUPERADMIN,
            },
        });
        const token = await this.generateToken(user.id_user);
        typeof(token);
        return "Register Berhasil Silakan Login";
    }

    async login(email: string, password: string): Promise<{ token: string, role: string}> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const token = await this.generateToken(user.id_user);
        return { token, role: user.role };
    }

    async validateToken(token: string): Promise<any> {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
