/*
  Warnings:

  - You are about to drop the `bundlepackage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bundleproducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promotional` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bundleproducts` DROP FOREIGN KEY `bundleProducts_bundlePackage_id_fkey`;

-- DropForeignKey
ALTER TABLE `bundleproducts` DROP FOREIGN KEY `bundleProducts_product_id_fkey`;

-- DropTable
DROP TABLE `bundlepackage`;

-- DropTable
DROP TABLE `bundleproducts`;

-- DropTable
DROP TABLE `promotional`;

-- CreateTable
CREATE TABLE `specialOffer` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `productId` CHAR(36) NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `specialOffer` ADD CONSTRAINT `specialOffer_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
