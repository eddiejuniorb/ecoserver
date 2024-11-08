/*
  Warnings:

  - You are about to drop the column `userId` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;
