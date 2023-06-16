-- CreateEnum
CREATE TYPE "Survey" AS ENUM ('PRE', 'POST');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SELECT', 'SCALE', 'OPEN');

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "survey" "Survey" NOT NULL,
    "title" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "questionId" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("resultId","questionId")
);

-- CreateTable
CREATE TABLE "_ProductToResult" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_survey_order_key" ON "Question"("survey", "order");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToResult_AB_unique" ON "_ProductToResult"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToResult_B_index" ON "_ProductToResult"("B");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToResult" ADD CONSTRAINT "_ProductToResult_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToResult" ADD CONSTRAINT "_ProductToResult_B_fkey" FOREIGN KEY ("B") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
