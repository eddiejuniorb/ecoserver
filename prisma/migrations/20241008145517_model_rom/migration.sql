-- CreateTable
CREATE TABLE `on_sales` (
    `id` CHAR(36) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `sub_title` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `btn_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `smallHeader` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `link_name` VARCHAR(191) NOT NULL,
    `link_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seo` (
    `id` CHAR(36) NOT NULL,
    `favicon` VARCHAR(191) NOT NULL,
    `meta_title` VARCHAR(191) NOT NULL,
    `meta_description` VARCHAR(191) NOT NULL,
    `meta_url` VARCHAR(191) NOT NULL,
    `meta_keywords` VARCHAR(191) NOT NULL,
    `meta_image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotional` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `button_name` VARCHAR(191) NOT NULL,
    `button_link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
