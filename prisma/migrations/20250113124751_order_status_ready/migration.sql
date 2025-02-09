-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('placed', 'processing', 'ready', 'cancelled', 'en_route', 'delivered') NOT NULL DEFAULT 'placed';
