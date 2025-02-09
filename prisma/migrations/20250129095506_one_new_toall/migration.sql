/*
  Warnings:

  - You are about to drop the `cartitems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cartitems` DROP FOREIGN KEY `CartItems_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitems` DROP FOREIGN KEY `CartItems_productId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitems` DROP FOREIGN KEY `CartItems_variant_id_fkey`;

-- DropTable
DROP TABLE `cartitems`;
