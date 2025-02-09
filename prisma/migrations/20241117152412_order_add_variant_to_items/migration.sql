-- AlterTable
ALTER TABLE `orderitems` ADD COLUMN `variantsId` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_variantsId_fkey` FOREIGN KEY (`variantsId`) REFERENCES `variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
