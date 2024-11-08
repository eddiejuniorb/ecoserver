/*
  Warnings:

  - You are about to drop the column `SKU` on the `variants` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `variants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `variants` DROP COLUMN `SKU`,
    DROP COLUMN `discount`;
