-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;

-- CreateTable
CREATE TABLE `our_shop` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `time_avalable1` VARCHAR(191) NOT NULL,
    `time_avalable2` VARCHAR(191) NULL,
    `google_address_link` VARCHAR(191) NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `termCondition` (
    `id` CHAR(36) NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `privacyPolicy` (
    `id` CHAR(36) NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
