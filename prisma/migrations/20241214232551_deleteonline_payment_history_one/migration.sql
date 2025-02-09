/*
  Warnings:

  - You are about to drop the `onlinepaymenthistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `onlinepaymenthistory` DROP FOREIGN KEY `onlinePaymentHistory_order_id_fkey`;

-- DropTable
DROP TABLE `onlinepaymenthistory`;
