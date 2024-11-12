-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_our_shopId_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `our_shopId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_our_shopId_fkey` FOREIGN KEY (`our_shopId`) REFERENCES `our_shop`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
