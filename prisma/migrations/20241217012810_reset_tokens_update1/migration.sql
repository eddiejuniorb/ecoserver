-- DropIndex
DROP INDEX `resetTokens_user_id_key` ON `resettokens`;

-- AlterTable
ALTER TABLE `resettokens` ADD PRIMARY KEY (`user_id`);
