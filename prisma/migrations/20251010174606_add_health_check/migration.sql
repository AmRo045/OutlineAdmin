-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverId" INTEGER NOT NULL,
    "lastCheckedAt" DATETIME,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "notification" TEXT,
    "notificationConfig" TEXT,
    "notificationSentAt" DATETIME,
    "notificationCooldown" INTEGER NOT NULL DEFAULT 5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealthCheck_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthCheck_serverId_key" ON "HealthCheck"("serverId");
