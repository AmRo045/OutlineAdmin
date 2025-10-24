-- CreateTable
CREATE TABLE "NotificationChannel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HealthCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverId" INTEGER NOT NULL,
    "notificationChannelId" INTEGER,
    "lastCheckedAt" DATETIME,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "notification" TEXT,
    "notificationConfig" TEXT,
    "notificationSentAt" DATETIME,
    "notificationCooldown" INTEGER NOT NULL DEFAULT 5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HealthCheck_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HealthCheck_notificationChannelId_fkey" FOREIGN KEY ("notificationChannelId") REFERENCES "NotificationChannel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_HealthCheck" ("createdAt", "id", "interval", "isAvailable", "lastCheckedAt", "notification", "notificationConfig", "notificationCooldown", "notificationSentAt", "serverId", "updatedAt") SELECT "createdAt", "id", "interval", "isAvailable", "lastCheckedAt", "notification", "notificationConfig", "notificationCooldown", "notificationSentAt", "serverId", "updatedAt" FROM "HealthCheck";
DROP TABLE "HealthCheck";
ALTER TABLE "new_HealthCheck" RENAME TO "HealthCheck";
CREATE UNIQUE INDEX "HealthCheck_serverId_key" ON "HealthCheck"("serverId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
