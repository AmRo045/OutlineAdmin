import { DynamicAccessKey } from "@prisma/client";

import prisma from "@/prisma/db";
import { createLogger } from "@/src/core/logger";
import { LoggerContext } from "@/src/core/definitions";
import { getDakExpiryDateBasedOnValidityPeriod } from "@/src/core/utils";
import { removeSelfManagedDynamicAccessKeyAccessKeys } from "@/src/core/actions/dynamic-access-key";

let logger = createLogger(LoggerContext.DakJob);

const main = async () => {
    logger.info("Starting Dynamic Access Key maintenance job...");

    const dynamicAccessKeys = await prisma.dynamicAccessKey.findMany();

    logger.info(`Found ${dynamicAccessKeys.length} DAK(s) to process.`);

    const processSelfManagedDak = async (dak: DynamicAccessKey) => {
        const expiryDate = getDakExpiryDateBasedOnValidityPeriod(dak);

        if (expiryDate && expiryDate.getTime() <= Date.now()) {
            logger.warn("DAK expired — removing access keys", {
                id: dak.id,
                name: dak.name,
                expiryDate
            });

            await removeSelfManagedDynamicAccessKeyAccessKeys(dak.id);

            return;
        }

        const pattern = `self-managed-dak-access-key-${dak.id}`;
        const accessKeys = await prisma.accessKey.findMany({
            where: { name: { contains: pattern } }
        });

        logger.info("Access keys found", {
            id: dak.id,
            name: dak.name,
            count: accessKeys.length
        });

        const dataLimit = dak.dataLimit ? Number(dak.dataLimit) : 0;
        const bytesPerMB = 1024 * 1024;
        const dataLimitInBytes = dataLimit * bytesPerMB;
        const dataUsage = accessKeys.reduce((acc, key) => acc + Number(key.dataUsage || 0), 0);
        const isDataUsageExceeded = dataLimit && dataUsage >= dataLimitInBytes;

        if (isDataUsageExceeded && dataLimit > 0) {
            logger.warn("DAK exceeded data limit — removing access keys", {
                id: dak.id,
                name: dak.name,
                dataUsage,
                dataLimitInBytes
            });

            await removeSelfManagedDynamicAccessKeyAccessKeys(dak.id);
        }

        if (dataUsage > dak.dataUsage) {
            await prisma.dynamicAccessKey.update({
                where: { id: dak.id },
                data: { dataUsage }
            });

            logger.info("Data usage updated", {
                id: dak.id,
                name: dak.name,
                dataUsage
            });
        }
    };

    const processManualDak = async (dak: DynamicAccessKey) => {
        const accessKeys = await prisma.dynamicAccessKey
            .findUnique({
                where: { id: dak.id }
            })
            .accessKeys();

        if (!accessKeys) {
            logger.info("DAK has no access keys");

            return;
        }

        const dataUsage = accessKeys.reduce((acc, key) => acc + Number(key.dataUsage || 0), 0);

        if (dataUsage > dak.dataUsage) {
            await prisma.dynamicAccessKey.update({
                where: { id: dak.id },
                data: { dataUsage }
            });

            logger.info("Data usage updated", {
                id: dak.id,
                name: dak.name,
                dataUsage
            });
        }
    };

    for (const dak of dynamicAccessKeys) {
        try {
            logger.info("Checking DAK", { id: dak.id, name: dak.name });

            if (dak.isSelfManaged) {
                await processSelfManagedDak(dak);
            } else {
                await processManualDak(dak);
            }

            logger.info("Finished processing DAK", { id: dak.id, name: dak.name });
        } catch (error) {
            logger.error("Error processing DAK", { id: dak.id, name: dak.name, error });
        }
    }
};

main()
    .then(() => {
        logger.info("Dynamic Access Keys Script Executed Successfully 😎");
    })
    .catch((error) => {
        logger.info("Dynamic Access Keys Script Failed Successfully 🥺");
        logger.error(error);
    });
