-- CreateTable
CREATE TABLE `Category` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `image` VARCHAR(250) NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `description` TEXT NOT NULL,
    `slug` TEXT NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `base_price` DECIMAL(10, 0) NOT NULL,
    `stock` INTEGER NOT NULL,
    `discount` INTEGER NULL DEFAULT 0,
    `customable` BOOLEAN NOT NULL DEFAULT false,
    `customise_price` DOUBLE NULL DEFAULT 0.00,
    `images` TEXT NOT NULL,
    `publish` BOOLEAN NOT NULL DEFAULT true,
    `views` INTEGER NOT NULL DEFAULT 0,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `options` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `optionvalues` (
    `id` CHAR(36) NOT NULL,
    `option_id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variants` (
    `id` CHAR(36) NOT NULL,
    `image` VARCHAR(191) NULL,
    `discount` INTEGER NULL DEFAULT 0,
    `SKU` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productId` CHAR(36) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bigsales` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `btn_name` VARCHAR(191) NOT NULL,
    `target_link` VARCHAR(191) NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variantoption` (
    `id` CHAR(36) NOT NULL,
    `variant_id` VARCHAR(191) NOT NULL,
    `option_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bundlePackage` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `bundlePackage_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bundleProducts` (
    `product_id` VARCHAR(191) NOT NULL,
    `bundlePackage_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`product_id`, `bundlePackage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `minimum` DOUBLE NOT NULL DEFAULT 0.00,
    `start` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `firstname` VARCHAR(250) NOT NULL,
    `lastname` VARCHAR(250) NOT NULL,
    `role` ENUM('user', 'admin', 'cashier', 'operator') NOT NULL DEFAULT 'user',
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(250) NOT NULL,
    `ban` BOOLEAN NOT NULL DEFAULT false,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` CHAR(36) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `totalPrice` DECIMAL(10, 0) NOT NULL,
    `status` ENUM('pending', 'processing', 'cancelled', 'delivered', 'shipped') NOT NULL DEFAULT 'pending',
    `orderNumber` INTEGER NOT NULL DEFAULT 0,
    `note` VARCHAR(191) NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uat` DATETIME(3) NOT NULL,
    `customise_total` DOUBLE NOT NULL DEFAULT 0.00,
    `shipping` DOUBLE NOT NULL DEFAULT 0.00,
    `discount` DOUBLE NOT NULL DEFAULT 0.00,
    `address_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Order_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` CHAR(36) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `AddressOne` VARCHAR(191) NULL,
    `AdressTwo` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItems` (
    `id` CHAR(36) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 0) NOT NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` CHAR(36) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItems` (
    `id` CHAR(36) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variant_id` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `customisation_price` DOUBLE NOT NULL,
    `customise` BOOLEAN NOT NULL,
    `cartId` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `CartItems_productId_customise_variant_id_key`(`productId`, `customise`, `variant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banner` (
    `id` CHAR(36) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `sub_title` VARCHAR(191) NOT NULL,
    `button_name` VARCHAR(191) NOT NULL,
    `button_link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payments` (
    `id` CHAR(36) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `type` ENUM('card', 'pickup', 'momo', 'ondelivery') NOT NULL,
    `amount` DECIMAL(10, 0) NOT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Payments_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staffs` (
    `id` CHAR(36) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `display_picture` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'cashier', 'operator') NOT NULL DEFAULT 'cashier',

    UNIQUE INDEX `staffs_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `optionvalues` ADD CONSTRAINT `optionvalues_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `options`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variants` ADD CONSTRAINT `variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variantoption` ADD CONSTRAINT `variantoption_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variantoption` ADD CONSTRAINT `variantoption_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `optionvalues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bundleProducts` ADD CONSTRAINT `bundleProducts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bundleProducts` ADD CONSTRAINT `bundleProducts_bundlePackage_id_fkey` FOREIGN KEY (`bundlePackage_id`) REFERENCES `bundlePackage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItems` ADD CONSTRAINT `CartItems_variant_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItems` ADD CONSTRAINT `CartItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItems` ADD CONSTRAINT `CartItems_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
