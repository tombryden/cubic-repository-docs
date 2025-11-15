-- CreateTable
CREATE TABLE "Wiki" (
    "id" TEXT NOT NULL,
    "repository" TEXT NOT NULL,

    CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiPage" (
    "id" TEXT NOT NULL,
    "wikiId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "markdownContent" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "WikiPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WikiPage" ADD CONSTRAINT "WikiPage_wikiId_fkey" FOREIGN KEY ("wikiId") REFERENCES "Wiki"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
