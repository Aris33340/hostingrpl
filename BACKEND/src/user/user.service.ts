// src/user/user.service.ts
import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { user, userRole } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { createReadStream, existsSync, stat } from 'fs';
import { join } from 'path';
import { Prisma } from '@prisma/client'; // bila perlu


export interface ExcelUserData {
    username: string;
    email: string;
    password: string;
    role: userRole;
}

@Injectable()
export class UserService {
    private readonly defaultPassword = 'Password123!';
    private readonly TEMPLATE_PATH = join(process.cwd(), './public/template/UserWisudaTemplate_v1.xlsx');
    constructor(private readonly prisma: PrismaService, private authService: AuthService) { }

    /**
     * Mengambil semua data pengguna dari database.
     * @returns Promise<User[]> Daftar semua pengguna.
     */
    async findAll(): Promise<Omit<user, 'password'>[]> {
        return this.prisma.user.findMany({
            select: {
                id_user: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    /**
     * Mengambil Stream dari file template Excel statis yang tersimpan di server.
     * @returns { path: string, readStream: ReadStream } Informasi file yang akan distreaming.
     */
    async getStaticExcelTemplate(): Promise<{ path: string, readStream: ReturnType<typeof createReadStream> }> {
        const filePath = this.TEMPLATE_PATH;

        // 1. Cek apakah file ada di disk
        if (!existsSync(filePath)) {
            throw new NotFoundException('Template file tidak ditemukan di server. Harap hubungi administrator.');
        }

        // 2. Cek apakah path yang ditemukan adalah file
        return new Promise((resolve, reject) => {
            stat(filePath, (err, stats) => {
                if (err) {
                    return reject(new InternalServerErrorException('Gagal mengakses properti file template.'));
                }
                if (!stats.isFile()) {
                    return reject(new InternalServerErrorException('Path yang ditemukan bukan file.'));
                }

                // 3. Buat read stream
                const fileStream = createReadStream(filePath);

                resolve({ path: filePath, readStream: fileStream });
            });
        });
    }

    /**
     * Memproses dan mendaftarkan pengguna secara massal dari buffer file Excel.
     * @param buffer Buffer file Excel yang diunggah.
     * @returns Promise<string> Ringkasan hasil pendaftaran.
     */
    async registerBatch(buffer: any): Promise<string> {
        const workbook = new ExcelJS.Workbook();
        try {
            await workbook.xlsx.load(buffer);
        } catch (e) {
            throw new BadRequestException('Gagal memuat file Excel. Pastikan formatnya benar.');
        }

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new BadRequestException('File Excel tidak memiliki worksheet.');
        }

        const userData: ExcelUserData[] = [];
        const expectedHeaders = ['username', 'email', 'password', 'role'];

        const headers: string[] = [];
        worksheet.getRow(1).eachCell((cell) => {
            headers.push(cell.value ? cell.value.toString().toLowerCase().trim() : '');
        });

        if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
            throw new BadRequestException(`Format header Excel tidak sesuai. Harusnya: ${expectedHeaders.join(', ')}.`);
        }

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const username = row.getCell(1).text.trim();
                const email = row.getCell(2).text.trim();
                const password = row.getCell(3).text.trim();
                const roleString = row.getCell(4).text.trim().toUpperCase() as userRole;

                if (!username || !email || !roleString) {
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new BadRequestException(`Baris ${rowNumber}: Email "${email}" tidak valid.`);
                }

                if (!Object.values(userRole).includes(roleString)) {
                    throw new BadRequestException(`Baris ${rowNumber}: Role "${roleString}" tidak valid. Role yang diizinkan: ${Object.values(userRole).join(', ')}.`);
                }

                userData.push({ username, email, password, role: roleString });
            }
        });

        if (userData.length === 0) {
            throw new BadRequestException('Tidak ada data pengguna yang valid ditemukan di file Excel.');
        }

        const emails = userData.map(d => d.email);
        const usernames = userData.map(d => d.username);
        const passwords = userData.map(d => d.password);

        if (new Set(emails).size !== emails.length) {
            throw new BadRequestException('Ditemukan duplikasi email dalam file Excel.');
        }
        if (new Set(usernames).size !== usernames.length) {
            throw new BadRequestException('Ditemukan duplikasi username dalam file Excel.');
        }

        const existingEmails = await this.prisma.user.findMany({
            where: { email: { in: emails } },
            select: { email: true }
        });
        if (existingEmails.length > 0) {
            const existingList = existingEmails.map(e => e.email).join(', ');
            throw new UnauthorizedException(`Email sudah terdaftar di database: ${existingList}`);
        }

        const existingUsernames = await this.prisma.user.findMany({
            where: { username: { in: usernames } },
            select: { username: true }
        });
        if (existingUsernames.length > 0) {
            const existingList = existingUsernames.map(u => u.username).join(', ');
            throw new UnauthorizedException(`Username sudah terdaftar di database: ${existingList}`);
        }

        const hashedPassword = await this.authService.hashPassword(this.defaultPassword);
        const dataToCreate = userData.map(async data =>

        ({
            username: data.username,
            email: data.email,
            role: data.role,
            password: data.password,
        })
        );

        try {
            dataToCreate.forEach(async e => {
                await this.authService.register((await e).username, (await e).email, (await e).password, "secretTOken", (await e).role)
            })
            const successMessage = `akun berhasil didaftarkan. Password default untuk semua akun adalah: **${this.defaultPassword}**. Harap informasikan pengguna untuk segera mengubahnya.`;
            return successMessage;

        } catch (error) {
            console.error('Error during batch registration:', error);
            throw new InternalServerErrorException('Gagal menyimpan data pengguna ke database.');
        }
    }
    async updateUser(id_user: number, payload: Partial<{ username: string; email: string; password: string; role: string; }>) {
        const user = await this.prisma.user.findUnique({ where: { id_user } });
        if (!user) throw new NotFoundException('User tidak ditemukan');
      
        if (payload.email && payload.email !== user.email) {
          const exist = await this.prisma.user.findUnique({ where: { email: payload.email } });
          if (exist && exist.id_user !== id_user) throw new BadRequestException('Email sudah terpakai');
        }
      
        if (payload.username && payload.username !== user.username) {
          const exist = await this.prisma.user.findUnique({ where: { username: payload.username } });
          if (exist && exist.id_user !== id_user) throw new BadRequestException('Username sudah terpakai');
        }
      
        const dataToUpdate: any = {
          ...payload
        };
      
        if (payload.password) {
          const hashed = await this.authService.hashPassword(payload.password);
          dataToUpdate.password = hashed;
        } else {
          delete dataToUpdate.password;
        }
      
        try {
          const updated = await this.prisma.user.update({
            where: { id_user },
            data: dataToUpdate,
            select: {
              id_user: true,
              username: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true
            }
          });
          return updated;
        } catch (e) {
          console.error('Error updateUser:', e);
          throw new InternalServerErrorException('Gagal mengupdate user');
        }
      }
      
      /**
       * Delete user by id_user
       */
      async removeUser(id_user: number) {
        // cek dulu
        const user = await this.prisma.user.findUnique({ where: { id_user } });
        if (!user) throw new NotFoundException('User tidak ditemukan');
      
        try {
          await this.prisma.user.delete({ where: { id_user } });
          return { message: 'User berhasil dihapus' };
        } catch (e) {
          console.error('Error removeUser:', e);
          throw new InternalServerErrorException('Gagal menghapus user');
        }
      }
}