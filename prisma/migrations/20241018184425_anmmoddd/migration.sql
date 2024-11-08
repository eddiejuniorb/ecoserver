/*
  Warnings:

  - Added the required column `uat` to the `on_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uat` to the `smallHeader` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `on_sales` ADD COLUMN `iat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `uat` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `smallheader` ADD COLUMN `uat` DATETIME(3) NOT NULL;
