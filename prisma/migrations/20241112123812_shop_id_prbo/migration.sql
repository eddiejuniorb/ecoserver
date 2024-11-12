-- AlterTable
ALTER TABLE `order` MODIFY `our_shopId` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;
