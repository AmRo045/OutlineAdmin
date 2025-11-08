import prisma from "@/prisma/db";
import { createLogger } from "@/src/core/logger";
import { LoggerContext } from "@/src/core/definitions";
import { getDakExpiryDateBasedOnValidityPeriod } from "@/src/core/utils";
import { removeSelfManagedDynamicAccessKeyAccessKeys } from "@/src/core/actions/dynamic-access-key";

let logger = createLogger(LoggerContext.DakJob);

const main = async () => {
    logger.info("Starting Dynamic Access Key maintenance job...");

    const dynamicAccessKeys = await prisma.dynamicAccessKey.findMany({
        where: { isSelfManaged: true }
    });

    logger.info(`Found ${dynamicAccessKeys.length} self-managed DAK(s) to process.`);

    for (const dak of dynamicAccessKeys) {
        try {
            logger.info("Checking DAK", { id: dak.id, name: dak.name });

            let keysRemovedDueToExpiration = false;

            const expiryDate = getDakExpiryDateBasedOnValidityPeriod(dak);

            if (expiryDate && expiryDate.getTime() <= Date.now()) {
                logger.warn("DAK expired — removing access keys", {
                    id: dak.id,
                    name: dak.name,
                    expiryDate
                });
                await removeSelfManagedDynamicAccessKeyAccessKeys(dak.id);
                keysRemovedDueToExpiration = true;
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

            // --- Calculate total data usage ---
            const dataUsage = accessKeys.reduce((acc, key) => acc + Number(key.dataUsage || 0), 0);

            await prisma.dynamicAccessKey.update({
                where: { id: dak.id },
                data: { dataUsage }
            });

            logger.info("Data usage updated", {
                id: dak.id,
                name: dak.name,
                dataUsage
            });

            if (!keysRemovedDueToExpiration && dak.dataLimit) {
                const bytesPerMB = 1024 * 1024;
                const dataLimitInBytes = Number(dak.dataLimit) * bytesPerMB;

                if (dataUsage >= dataLimitInBytes) {
                    logger.warn("DAK exceeded data limit — removing access keys", {
                        id: dak.id,
                        name: dak.name,
                        dataUsage,
                        dataLimitInBytes
                    });
                    await removeSelfManagedDynamicAccessKeyAccessKeys(dak.id);
                }
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
