/*
  Warnings:

  - Made the column `AddressOne` on table `address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `address` MODIFY `AddressOne` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `delivery_type` ENUM('ship', 'pickup') NOT NULL DEFAULT 'ship';

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;
