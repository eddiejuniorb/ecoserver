/*
  Warnings:

  - You are about to alter the column `status` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('placed', 'processing', 'cancelled', 'en_route', 'delivered') NOT NULL DEFAULT 'placed';
