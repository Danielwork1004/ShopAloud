/*
  Warnings:

  - You are about to drop the column `audioPath` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "audioPath",
ADD COLUMN     "audioPaths" TEXT[];
