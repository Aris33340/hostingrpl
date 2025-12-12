import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs'; // Menggunakan import standar
const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
}

async function main() {
    const user = await prisma.user.create({
        data: {
            email: 'stisGrad65@stis.ac.id',
            username: 'SuperAdmin',
            password: await hashPassword('password132'),
            role: "SUPERADMIN"
        }
    })
    const folder = await prisma.file.create({
        data: {
            file_name: "Project Uji Coba",
            path: "./public/output/rendered/TEST",
            type: "FOLDER",
            id_user: user.id_user,
        }
    })
    for (let i = 0; i < 10; i++) {
        await prisma.file.create({
            data: {
                file_name: `file ${i}`,
                path: `./public/output/rendered/${i}`,
                type: 'application/pdf',
                id_user: user.id_user,
                id_parent: folder.id_file,
            }
        })
    }
    //setup settings
    await prisma.settings.createMany({
        data: [
            { key: "HASH_KEY", value: "stis65" },
            { key: "MAIL_USER", value: "testingstisgrad@gmail.com" },
            { key: "MAIL_PASS", value: "mdfkcajvjpmgpeqx" }
        ]
    })
    console.log('Seeding database...');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
