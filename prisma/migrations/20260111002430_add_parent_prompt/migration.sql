-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Prompt_parentId_idx" ON "Prompt"("parentId");

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
