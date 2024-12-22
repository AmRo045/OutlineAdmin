-- CreateTable
CREATE TABLE "Server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apiUrl" TEXT NOT NULL,
    "apiCertSha256" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "hostnameOrIp" TEXT NOT NULL,
    "hostnameForNewAccessKeys" TEXT NOT NULL,
    "portForNewAccessKeys" INTEGER NOT NULL,
    "totalDataUsage" INTEGER,
    "isMetricsEnabled" BOOLEAN NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "apiCreatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
