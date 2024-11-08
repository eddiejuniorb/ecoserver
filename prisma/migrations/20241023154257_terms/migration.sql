/*
  Warnings:

  - You are about to drop the column `raw` on the `privacypolicy` table. All the data in the column will be lost.
  - You are about to drop the column `raw` on the `termcondition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `privacypolicy` DROP COLUMN `raw`;

-- AlterTable
ALTER TABLE `staffs` ALTER COLUMN `uat` DROP DEFAULT;

-- AlterTable
ALTER TABLE `termcondition` DROP COLUMN `raw`;
