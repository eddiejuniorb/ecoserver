-- AlterTable
ALTER TABLE `orderitems` ADD COLUMN `discount` DOUBLE NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;