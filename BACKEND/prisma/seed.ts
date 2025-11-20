// import { PrismaClient } from "../generated/prisma";
// import { users } from "./users";

// const prisma = new PrismaClient();

// async function main() {
//     await prisma.user.deleteMany({})
//     // for (let u in users) {
//     //     await prisma.user.create({
//     //         data: {
//     //             username: users[u].username,
//     //             email: users[u].email,
//     //             password: users[u].password,
//     //             role: users[u].role
//     //         }
//     //     })
//     // }
//     // await prisma.mahasiswa.create({
//     //     data: {
//     //         nim: 222313127,
//     //         nama: "Test Encrypt",
//     //         kelas: "3SI2"
//     //     }
//     // })
//     // await prisma.tamu.create({
//     //     data:{
//     //         asal_instansi:"Universitas Test",
//     //         email:"test@gmail.com",
//     //         nama:"aaaa",
//     //     }
//     // })
//     await prisma.presensi.create({
//         data:{
//             id_tamu:1,
//         }
//     })
// }

// main().catch(e => {
//     console.log(e)
//     process.exit(1)
// }).finally(() => {
//     prisma.$disconnect()
// })


import { PrismaClient } from "@prisma/client";
import { $Enums as Enum } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    await prisma.user.deleteMany({})
    await prisma.tamu.deleteMany({})
    await prisma.mahasiswa.deleteMany({})
    await prisma.file.deleteMany({})
    await prisma.emailSendStatus.deleteMany({})
    await prisma.file.deleteMany({})
    // ----------- Users -----------
    for (let i = 1; i <= 10; i++) {
        await prisma.user.create({
            data: {
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: `password${i}`, // hash password jika diperlukan
                role: i % 4 === 0 ? Enum.userRole.BUKUWISUDA : (i % 4 === 1 ? Enum.userRole.PETUGAS : (i % 4 === 2 ? Enum.userRole.SEKRETARIAT : Enum.userRole.SUPERADMIN)),
            },
        });
    }

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
                createdAt:new Date()
            }
        })
        await prisma.emailSendStatus.create({
            data:{
                email:res.nim+'@stis.ac.id',
                pesertaId_peserta:pesertares.id_peserta,
                status:0,
                waktu_dikirim:new Date(),
                createdAt:new Date()
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
                createdAt:new Date()
            }
        })
        await prisma.emailSendStatus.create({
            data: {
                email: res.email,
                pesertaId_peserta:pesertares.id_peserta,
                status: 0,
                waktu_dikirim: new Date(),
                createdAt:new Date()
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
