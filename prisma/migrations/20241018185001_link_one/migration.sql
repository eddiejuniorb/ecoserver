/*
  Warnings:

  - You are about to drop the column `btn_name` on the `on_sales` table. All the data in the column will be lost.
  - Added the required column `button_link` to the `on_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `button_name` to the `on_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `on_sales` DROP COLUMN `btn_name`,
    ADD COLUMN `button_link` VARCHAR(191) NOT NULL,
    ADD COLUMN `button_name` VARCHAR(191) NOT NULL;
