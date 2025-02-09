/*
  Warnings:

  - The `dealEnd` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dealStart` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `dealEnd`,
    ADD COLUMN `dealEnd` DATETIME(3) NULL,
    DROP COLUMN `dealStart`,
    ADD COLUMN `dealStart` DATETIME(3) NULL;
