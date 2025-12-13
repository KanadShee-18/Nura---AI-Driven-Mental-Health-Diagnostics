-- AlterTable
ALTER TABLE "checkup" ALTER COLUMN "anonymity" DROP NOT NULL,
ALTER COLUMN "coworkers" DROP NOT NULL,
ALTER COLUMN "supervisor" DROP NOT NULL;
