-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DynamicAccessKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "loadBalancerAlgorithm" TEXT NOT NULL,
    "prefix" TEXT,
    "isSelfManaged" BOOLEAN NOT NULL DEFAULT false,
    "serverPoolValue" TEXT,
    "serverPoolType" TEXT,
    "activeServerId" INTEGER,
    "usageInterval" TEXT,
    "usageStartedAt" DATETIME,
    "dataUsage" BIGINT NOT NULL DEFAULT 0,
    "dataLimit" INTEGER,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DynamicAccessKey" ("createdAt", "expiresAt", "id", "isSelfManaged", "loadBalancerAlgorithm", "name", "path", "prefix", "serverPoolType", "serverPoolValue", "activeServerId", "updatedAt") SELECT "createdAt", "expiresAt", "id", "isSelfManaged", "loadBalancerAlgorithm", "name", "path", "prefix", "serverPoolType", "serverPoolValue", "activeServerId", "updatedAt" FROM "DynamicAccessKey";
DROP TABLE "DynamicAccessKey";
ALTER TABLE "new_DynamicAccessKey" RENAME TO "DynamicAccessKey";
CREATE UNIQUE INDEX "DynamicAccessKey_path_key" ON "DynamicAccessKey"("path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
