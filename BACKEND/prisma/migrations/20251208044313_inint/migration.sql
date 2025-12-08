-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_id_parent_fkey`;

-- DropIndex
DROP INDEX `file_id_parent_fkey` ON `file`;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_id_parent_fkey` FOREIGN KEY (`id_parent`) REFERENCES `file`(`id_file`) ON DELETE CASCADE ON UPDATE CASCADE;
