import { PrismaClient } from "@prisma/client";
import { $Enums as Enum } from "@prisma/client";
import * as bcrypt from 'bcryptjs'; // Menggunakan import standar
const prisma = new PrismaClient();
async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
}
async function main() {
    
    console.log('Seeding database...');
    await prisma.user.deleteMany({})
    await prisma.tamu.deleteMany({})
    await prisma.mahasiswa.deleteMany({})
    await prisma.file.deleteMany({})
    await prisma.emailSendStatus.deleteMany({})
    await prisma.file.deleteMany({})
    // ----------- Users -----------
    // Kita simpan ID user terakhir untuk dipakai bikin folder
    let lastUserId = 0;

    const user = await prisma.user.create({
        data:{
            email:'SUPERADMINwisuda65@gmail.com',
            password: String(await hashPassword('superwisuda65stisadmin')),
            role:"SUPERADMIN",
            username:'SUPERADMIN'
        }
    })
    lastUserId = user.id_user


    const folderDummy = await prisma.file.create({
        data: {
            file_name: "Folder Undangan (Seed)",
            type: "FOLDER",
            path: "folder-seed-dummy-unique", 
            id_user: lastUserId, 
        }
    });

    // ----------- Mahasiswa -----------
    for (let i = 1; i <= 10; i++) {
        const res = await prisma.mahasiswa.create({
            data: {
                nim: 1000 + i,
                nama: `Mahasiswa ${i}`,
                prodi: `Prodi ${i}`,
                kelas: `Kelas ${i}`,
                no_telp: `0812345678${i}`,
                nama_orang_tua: `Ortu ${i}`,
                judul_skripsi: `Judul Skripsi ${i}`,
                dosen_pembimbing: `Dosen ${i}`,
                daerah_asal: `Asal ${i}`,
                daerah_penempatan: `Penempatan ${i}`,
            },
        });
        const pesertares =  await prisma.peserta.create({
            data:{
                jenis:"mahasiswa",
                nim:res.nim,
                createdAt:new Date()
            }
        })

        await prisma.presensi.create({
            data:{
                id_peserta:pesertares.id_peserta,
                status:0,
                waktu_presensi: new Date(),
                createdAt:new Date(),
                id_user:user.id_user
            }
        })
        await prisma.emailSendStatus.create({
            data:{
                id_peserta:pesertares.id_peserta,
                status:0,
                waktu_dikirim:new Date(),
                createdAt:new Date(),
                // --- [TAMBAHAN BARU 2] ---
                id_folder: folderDummy.id_file
            }
        })
    }

    // ----------- Tamu -----------
    for (let i = 1; i <= 10; i++) {
        const res = await prisma.tamu.create({
            data: {
                nama: `Tamu ${i}`,
                email: `tamu${i}@example.com`,
                asal_instansi: `Instansi ${i}`,
                createdAt:new Date()
            },
        });
        const pesertares = await prisma.peserta.create({
            data:{
                jenis:"tamu",
                id_tamu:res.id_tamu,
                createdAt:new Date()
            }
        })
        await prisma.presensi.create({
            data:{
                id_peserta:pesertares.id_peserta,
                status:0,
                waktu_presensi: new Date(),
                createdAt:new Date(),
                id_user:user.id_user
            }
        })
        await prisma.emailSendStatus.create({
            data: {
                id_peserta:pesertares.id_peserta,
                status: 0,
                waktu_dikirim: new Date(),
                createdAt:new Date(),
                // --- [TAMBAHAN BARU 3] ---
                id_folder: folderDummy.id_file
            },
        });
    }


    console.log('Seeding finished.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
