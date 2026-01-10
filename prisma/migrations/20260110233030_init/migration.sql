-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalInput" TEXT NOT NULL,
    "enhancedOutput" TEXT NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "enhancement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prompt_userId_idx" ON "Prompt"("userId");
