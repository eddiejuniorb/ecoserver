/*
  Warnings:

  - Added the required column `user` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `user` VARCHAR(191) NOT NULL;
