/*
  Warnings:

  - You are about to drop the `options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `optionvalues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variantoption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `optionvalues` DROP FOREIGN KEY `optionvalues_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `variantoption` DROP FOREIGN KEY `variantoption_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `variantoption` DROP FOREIGN KEY `variantoption_variant_id_fkey`;

-- AlterTable
ALTER TABLE `variants` ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `material` VARCHAR(191) NULL,
    ADD COLUMN `size` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `options`;

-- DropTable
DROP TABLE `optionvalues`;

-- DropTable
DROP TABLE `variantoption`;
