-- CreateTable
CREATE TABLE `mahasiswa` (
    `nim` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `prodi` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `no_telp` VARCHAR(191) NOT NULL,
    `penempatan` VARCHAR(191) NOT NULL,
    `nama_orang_tua` VARCHAR(191) NOT NULL,
    `judul_skripsi` VARCHAR(191) NOT NULL,
    `dosen_pembimbing` VARCHAR(191) NOT NULL,
    `daerah_asal` VARCHAR(191) NOT NULL,
    `daerah_penempatan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tamu` (
    `id_tamu` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `asal_instansi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_tamu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presensi` (
    `id_presensi` INTEGER NOT NULL AUTO_INCREMENT,
    `waktu_presensi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` INTEGER NOT NULL DEFAULT 0,
    `nim` INTEGER NULL,
    `id_tamu` INTEGER NULL,

    PRIMARY KEY (`id_presensi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emailSendStatus` (
    `id_sendStatus` INTEGER NOT NULL AUTO_INCREMENT,
    `waktu_dikirim` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` INTEGER NOT NULL DEFAULT 0,
    `email` VARCHAR(191) NOT NULL,
    `nim` INTEGER NULL,
    `id_tamu` INTEGER NULL,

    PRIMARY KEY (`id_sendStatus`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id_file` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `nim` INTEGER NULL,
    `id_user` INTEGER NULL,

    PRIMARY KEY (`id_file`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `presensi` ADD CONSTRAINT `presensi_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presensi` ADD CONSTRAINT `presensi_id_tamu_fkey` FOREIGN KEY (`id_tamu`) REFERENCES `tamu`(`id_tamu`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emailSendStatus` ADD CONSTRAINT `emailSendStatus_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emailSendStatus` ADD CONSTRAINT `emailSendStatus_id_tamu_fkey` FOREIGN KEY (`id_tamu`) REFERENCES `tamu`(`id_tamu`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;
