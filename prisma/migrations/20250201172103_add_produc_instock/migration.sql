/*
  Warnings:

  - You are about to drop the column `publish` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `publish`,
    ADD COLUMN `in_stock` BOOLEAN NOT NULL DEFAULT true;
