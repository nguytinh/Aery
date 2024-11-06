/*
  Warnings:

  - You are about to drop the column `UserName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_UserName_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "UserName",
ADD COLUMN     "userName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
