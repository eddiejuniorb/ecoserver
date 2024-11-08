-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;

-- CreateTable
CREATE TABLE `storeSetting` (
    `id` CHAR(36) NOT NULL,
    `cash_on_delivery` BOOLEAN NOT NULL DEFAULT true,
    `paystack` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
