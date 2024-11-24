-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soals" (
    "id" TEXT NOT NULL,
    "soal" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "category" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_soals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "soalId" TEXT NOT NULL,
    "takenAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_soals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "soals_soal_key" ON "soals"("soal");

-- CreateIndex
CREATE UNIQUE INDEX "soals_url_key" ON "soals"("url");

-- CreateIndex
CREATE UNIQUE INDEX "soals_flag_key" ON "soals"("flag");

-- CreateIndex
CREATE UNIQUE INDEX "user_soals_userId_soalId_key" ON "user_soals"("userId", "soalId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_soals" ADD CONSTRAINT "user_soals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_soals" ADD CONSTRAINT "user_soals_soalId_fkey" FOREIGN KEY ("soalId") REFERENCES "soals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
