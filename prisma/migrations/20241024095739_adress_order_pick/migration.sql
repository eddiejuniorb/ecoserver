-- AlterTable
ALTER TABLE `order` ADD COLUMN `our_shopId` CHAR(36) NULL;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_our_shopId_fkey` FOREIGN KEY (`our_shopId`) REFERENCES `our_shop`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
