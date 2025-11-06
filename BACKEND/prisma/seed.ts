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


import { PrismaClient } from "../generated/prisma";
import { $Enums as Enum } from "../generated/prisma";

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
        await prisma.mahasiswa.create({
            data: {
                nim: 1000 + i,
                nama: `Mahasiswa ${i}`,
                prodi: `Prodi ${i}`,
                kelas: `Kelas ${i}`,
                no_telp: `0812345678${i}`,
                penempatan: `Penempatan ${i}`,
                nama_orang_tua: `Ortu ${i}`,
                judul_skripsi: `Judul Skripsi ${i}`,
                dosen_pembimbing: `Dosen ${i}`,
                daerah_asal: `Asal ${i}`,
                daerah_penempatan: `Penempatan ${i}`,
            },
        });
    }

    // ----------- Tamu -----------
    for (let i = 1; i <= 10; i++) {
        await prisma.tamu.create({
            data: {
                nama: `Tamu ${i}`,
                email: `tamu${i}@example.com`,
                asal_instansi: `Instansi ${i}`,
            },
        });
    }

    // ----------- Presensi -----------
    const mahasiswaList = await prisma.mahasiswa.findMany();
    for (let i = 0; i < mahasiswaList.length; i++) {
        const mhs = mahasiswaList[i];
        if (i % 2 === 0) continue; // skip index genap

        await prisma.presensi.create({
            data: {
                waktu_presensi: new Date(),
                status: 0,
                nim: mhs.nim,
            },
        });
    }

    const tamuList = await prisma.tamu.findMany();
    for (let i = 0; i < tamuList.length; i++) {
        const tamu = tamuList[i];
        if (i % 2 === 1) continue; // skip index genap

        await prisma.presensi.create({
            data: {
                waktu_presensi: new Date(),
                status: 0,
                id_tamu: tamu.id_tamu,
            },
        });
    }

    // ----------- EmailSendStatus -----------
    for( let i = 0; i < mahasiswaList.length; i++) {
        const mhs = mahasiswaList[i];
        if (i % 2 === 0) continue; // skip index genap

        await prisma.emailSendStatus.create({
            data: {
                email:mhs.nim + '@stis.ac.id',
                status: 0,
                waktu_dikirim: new Date(),
            },
        });
    }
    for( let i = 0; i < tamuList.length; i++) {
        const tamu = tamuList[i];
        if (i % 2 === 1) continue; // skip index genap

        await prisma.emailSendStatus.create({
            data: {
                email:tamu.email,
                status: 0,
                waktu_dikirim: new Date(),
            },
        });
    }

    // ----------- File -----------
    const userList = await prisma.user.findMany();
    for (let i = 0; i < mahasiswaList.length; i++) {
        const user = userList[0];
        const mhs = mahasiswaList[i];
        console.log(mhs.nim);
        await prisma.file.create({
            data: {
                id_user:user.id_user,
                file_name: `file_mahasiswa${i}.pdf`,
                path: `/files/mahasiswa${i}.pdf`,
                type: 'pdf',
                nim: mhs.nim,
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
