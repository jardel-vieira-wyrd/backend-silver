-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TO_DO', 'DOING', 'DONE', 'CANCELED');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TO_DO',
    "priority" INTEGER,
    "deadline" TIMESTAMP(3),
    "list" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssignedTo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ReadableBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EditableBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UpdatableBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedTo_AB_unique" ON "_AssignedTo"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedTo_B_index" ON "_AssignedTo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ReadableBy_AB_unique" ON "_ReadableBy"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadableBy_B_index" ON "_ReadableBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditableBy_AB_unique" ON "_EditableBy"("A", "B");

-- CreateIndex
CREATE INDEX "_EditableBy_B_index" ON "_EditableBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UpdatableBy_AB_unique" ON "_UpdatableBy"("A", "B");

-- CreateIndex
CREATE INDEX "_UpdatableBy_B_index" ON "_UpdatableBy"("B");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedTo" ADD CONSTRAINT "_AssignedTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedTo" ADD CONSTRAINT "_AssignedTo_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadableBy" ADD CONSTRAINT "_ReadableBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadableBy" ADD CONSTRAINT "_ReadableBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditableBy" ADD CONSTRAINT "_EditableBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EditableBy" ADD CONSTRAINT "_EditableBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpdatableBy" ADD CONSTRAINT "_UpdatableBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpdatableBy" ADD CONSTRAINT "_UpdatableBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
