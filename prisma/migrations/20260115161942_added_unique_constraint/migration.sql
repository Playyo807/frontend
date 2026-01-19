/*
  Warnings:

  - A unique constraint covering the columns `[keyword]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Service_keyword_key` ON `Service`(`keyword`);
