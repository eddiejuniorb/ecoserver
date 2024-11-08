/*
  Warnings:

  - Added the required column `payment_mode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `payment_mode` ENUM('cod', 'paystack') NOT NULL;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;
