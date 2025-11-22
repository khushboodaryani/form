-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "disposition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);
