/*
  Warnings:

  - You are about to drop the column `age` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `anonymity` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `benefits` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `careOptions` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `coworkers` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `leave` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `mentalHealthConsequence` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `mentalHealthInterview` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `mentalVsPhysical` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `noEmployees` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `obsConsequence` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `physHealthConsequence` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `physHealthInterview` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `remoteWork` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `seekHelp` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `techCompany` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `wellnessProgram` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `workInterfere` on the `checkup` table. All the data in the column will be lost.
  - You are about to drop the column `yoga` on the `checkup` table. All the data in the column will be lost.
  - Added the required column `awareAboutCareOption` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faceDailyProblem` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `findInterestInWork` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habitChange` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `increasingStressLevel` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pastHistory` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sociallyWeak` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spendIndoors` to the `checkup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takenMentalHealthInterview` to the `checkup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "checkup" DROP COLUMN "age",
DROP COLUMN "anonymity",
DROP COLUMN "benefits",
DROP COLUMN "careOptions",
DROP COLUMN "coworkers",
DROP COLUMN "leave",
DROP COLUMN "mentalHealthConsequence",
DROP COLUMN "mentalHealthInterview",
DROP COLUMN "mentalVsPhysical",
DROP COLUMN "noEmployees",
DROP COLUMN "obsConsequence",
DROP COLUMN "physHealthConsequence",
DROP COLUMN "physHealthInterview",
DROP COLUMN "remoteWork",
DROP COLUMN "seekHelp",
DROP COLUMN "supervisor",
DROP COLUMN "techCompany",
DROP COLUMN "wellnessProgram",
DROP COLUMN "workInterfere",
DROP COLUMN "yoga",
ADD COLUMN     "awareAboutCareOption" TEXT NOT NULL,
ADD COLUMN     "faceDailyProblem" TEXT NOT NULL,
ADD COLUMN     "findInterestInWork" TEXT NOT NULL,
ADD COLUMN     "habitChange" TEXT NOT NULL,
ADD COLUMN     "increasingStressLevel" TEXT NOT NULL,
ADD COLUMN     "occupation" TEXT NOT NULL,
ADD COLUMN     "pastHistory" TEXT NOT NULL,
ADD COLUMN     "sociallyWeak" TEXT NOT NULL,
ADD COLUMN     "spendIndoors" TEXT NOT NULL,
ADD COLUMN     "takenMentalHealthInterview" TEXT NOT NULL;
