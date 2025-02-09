/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `onlinePaymentHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `onlinePaymentHistory_order_id_key` ON `onlinePaymentHistory`(`order_id`);
