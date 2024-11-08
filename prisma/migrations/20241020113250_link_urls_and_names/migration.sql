/*
  Warnings:

  - You are about to drop the column `button_link` on the `banner` table. All the data in the column will be lost.
  - You are about to drop the column `button_name` on the `banner` table. All the data in the column will be lost.
  - You are about to drop the column `button_link` on the `on_sales` table. All the data in the column will be lost.
  - You are about to drop the column `button_name` on the `on_sales` table. All the data in the column will be lost.
  - You are about to drop the column `button_link` on the `promotional` table. All the data in the column will be lost.
  - You are about to drop the column `button_name` on the `promotional` table. All the data in the column will be lost.
  - Added the required column `link_name` to the `banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_url` to the `banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_name` to the `on_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_url` to the `on_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_name` to the `promotional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_url` to the `promotional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `banner` DROP COLUMN `button_link`,
    DROP COLUMN `button_name`,
    ADD COLUMN `link_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `link_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `on_sales` DROP COLUMN `button_link`,
    DROP COLUMN `button_name`,
    ADD COLUMN `link_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `link_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `promotional` DROP COLUMN `button_link`,
    DROP COLUMN `button_name`,
    ADD COLUMN `link_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `link_url` VARCHAR(191) NOT NULL;
