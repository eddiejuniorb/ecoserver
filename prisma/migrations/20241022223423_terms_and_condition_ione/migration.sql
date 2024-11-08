/*
  Warnings:

  - Added the required column `raw` to the `privacyPolicy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raw` to the `termCondition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `privacypolicy` ADD COLUMN `raw` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;

-- AlterTable
ALTER TABLE `termcondition` ADD COLUMN `raw` VARCHAR(191) NOT NULL;
