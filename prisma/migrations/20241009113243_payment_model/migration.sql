/*
  Warnings:

  - You are about to drop the column `paid` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(3))`.
  - Added the required column `ref` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `promotional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `coupon_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `paid`,
    ADD COLUMN `ref` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('card', 'momo') NULL;

-- AlterTable
ALTER TABLE `promotional` ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `user_coupons` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `couponId` VARCHAR(191) NOT NULL,
    `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('used', 'applied') NOT NULL DEFAULT 'applied',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_coupons` ADD CONSTRAINT `user_coupons_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_coupons` ADD CONSTRAINT `user_coupons_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
