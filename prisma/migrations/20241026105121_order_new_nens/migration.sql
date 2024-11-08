/*
  Warnings:

  - You are about to drop the column `address_id` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_address_id_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `address_id`,
    ADD COLUMN `shippindAddress` JSON NULL;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;
