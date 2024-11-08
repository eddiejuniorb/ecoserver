-- AlterTable
ALTER TABLE `options` ADD COLUMN `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('pending', 'processing', 'cancelled', 'delivered', 'out_for_delivery', 'shipped') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `orderitems` ADD COLUMN `customisation` DOUBLE NULL DEFAULT 0.00;
