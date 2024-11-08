/*
  Warnings:

  - Made the column `type` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `payments` MODIFY `type` VARCHAR(191) NOT NULL;
