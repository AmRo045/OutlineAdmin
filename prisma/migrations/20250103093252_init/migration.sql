-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apiUrl" TEXT NOT NULL,
    "managementJson" TEXT NOT NULL,
    "apiCertSha256" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "hostnameOrIp" TEXT NOT NULL,
    "hostnameForNewAccessKeys" TEXT NOT NULL,
    "portForNewAccessKeys" INTEGER NOT NULL,
    "totalDataUsage" BIGINT,
    "isMetricsEnabled" BOOLEAN NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "apiCreatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "AccessKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverId" INTEGER NOT NULL,
    "apiId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT,
    "password" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "accessUrl" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "dataLimit" BIGINT,
    "dataLimitUnit" TEXT NOT NULL,
    "dataUsage" BIGINT NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AccessKey_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DynamicAccessKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "loadBalancerAlgorithm" TEXT NOT NULL,
    "prefix" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_AccessKeyDynamicAccessKeys" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AccessKeyDynamicAccessKeys_A_fkey" FOREIGN KEY ("A") REFERENCES "AccessKey" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AccessKeyDynamicAccessKeys_B_fkey" FOREIGN KEY ("B") REFERENCES "DynamicAccessKey" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_serverId_apiId_key" ON "AccessKey"("serverId", "apiId");

-- CreateIndex
CREATE UNIQUE INDEX "DynamicAccessKey_path_key" ON "DynamicAccessKey"("path");

-- CreateIndex
CREATE UNIQUE INDEX "_AccessKeyDynamicAccessKeys_AB_unique" ON "_AccessKeyDynamicAccessKeys"("A", "B");

-- CreateIndex
CREATE INDEX "_AccessKeyDynamicAccessKeys_B_index" ON "_AccessKeyDynamicAccessKeys"("B");
