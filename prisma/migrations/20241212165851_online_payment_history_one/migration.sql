/*
  Warnings:

  - Added the required column `link` to the `onlinePaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onlinepaymenthistory` ADD COLUMN `link` VARCHAR(191) NOT NULL;
