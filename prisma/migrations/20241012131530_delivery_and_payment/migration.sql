/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `Payments_orderId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `totalPrice`,
    ADD COLUMN `payment_status` ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid',
    ADD COLUMN `total` DECIMAL(10, 0) NOT NULL;

-- DropTable
DROP TABLE `payments`;

-- CreateTable
CREATE TABLE `shipping_cost` (
    `id` CHAR(36) NOT NULL,
    `area_name` VARCHAR(191) NOT NULL,
    `cost` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
