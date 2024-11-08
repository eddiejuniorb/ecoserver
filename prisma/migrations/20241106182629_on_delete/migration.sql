-- DropForeignKey
ALTER TABLE `orderitems` DROP FOREIGN KEY `OrderItems_order_id_fkey`;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
