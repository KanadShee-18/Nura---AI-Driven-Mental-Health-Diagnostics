-- CreateTable
CREATE TABLE "checkup" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "selfEmployed" TEXT NOT NULL,
    "familyHistory" TEXT NOT NULL,
    "workInterfere" TEXT NOT NULL,
    "noEmployees" TEXT NOT NULL,
    "remoteWork" TEXT NOT NULL,
    "techCompany" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "careOptions" TEXT NOT NULL,
    "wellnessProgram" TEXT NOT NULL,
    "seekHelp" TEXT NOT NULL,
    "anonymity" TEXT NOT NULL,
    "leave" TEXT NOT NULL,
    "mentalHealthConsequence" TEXT NOT NULL,
    "physHealthConsequence" TEXT NOT NULL,
    "coworkers" TEXT NOT NULL,
    "supervisor" TEXT NOT NULL,
    "mentalHealthInterview" TEXT NOT NULL,
    "physHealthInterview" TEXT NOT NULL,
    "mentalVsPhysical" TEXT NOT NULL,
    "obsConsequence" TEXT NOT NULL,
    "yoga" TEXT,
    "condition" TEXT,
    "treatment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "checkup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "checkup_userId_idx" ON "checkup"("userId");

-- AddForeignKey
ALTER TABLE "checkup" ADD CONSTRAINT "checkup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
