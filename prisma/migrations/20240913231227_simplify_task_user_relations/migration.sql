/*
  Warnings:

  - You are about to drop the `_AssignedTo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EditableBy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReadableBy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UpdatableBy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AssignedTo" DROP CONSTRAINT "_AssignedTo_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedTo" DROP CONSTRAINT "_AssignedTo_B_fkey";

-- DropForeignKey
ALTER TABLE "_EditableBy" DROP CONSTRAINT "_EditableBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_EditableBy" DROP CONSTRAINT "_EditableBy_B_fkey";

-- DropForeignKey
ALTER TABLE "_ReadableBy" DROP CONSTRAINT "_ReadableBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReadableBy" DROP CONSTRAINT "_ReadableBy_B_fkey";

-- DropForeignKey
ALTER TABLE "_UpdatableBy" DROP CONSTRAINT "_UpdatableBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_UpdatableBy" DROP CONSTRAINT "_UpdatableBy_B_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedTo" INTEGER[],
ADD COLUMN     "editableBy" INTEGER[],
ADD COLUMN     "readableBy" INTEGER[],
ADD COLUMN     "updatableBy" INTEGER[];

-- DropTable
DROP TABLE "_AssignedTo";

-- DropTable
DROP TABLE "_EditableBy";

-- DropTable
DROP TABLE "_ReadableBy";

-- DropTable
DROP TABLE "_UpdatableBy";
