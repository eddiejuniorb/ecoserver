-- CreateTable
CREATE TABLE `onlinePaymentHistory` (
    `id` CHAR(36) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `success` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `onlinePaymentHistory` ADD CONSTRAINT `onlinePaymentHistory_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
