import { Chip } from "@heroui/react";
import React from "react";
import { DynamicAccessKey } from "@prisma/client";

import { InfinityIcon } from "@/src/components/icons";
import { convertDataLimitToUnit, formatBytes } from "@/src/core/utils";
import { DataLimitUnit, DynamicAccessKeyStats } from "@/src/core/definitions";

interface Props {
    item: DynamicAccessKey | DynamicAccessKeyStats;
}

export default function DynamicAccessKeyDataUsageChip({ item }: Props) {
    const bytesPerMB = 1024 * 1024;
    const dataLimitInBytes = Number(item.dataLimit) * bytesPerMB;
    const isExceeded = item.dataLimit && item.dataUsage >= dataLimitInBytes;

    return (
        <Chip color={isExceeded ? "danger" : "default"} radius="sm" size="sm" variant="flat">
            <div className="flex gap-2 items-center">
                <span>{formatBytes(Number(item.dataUsage))}</span>

                {item.isSelfManaged && (
                    <>
                        <span className="text-default-500">of</span>
                        {item.dataLimit ? (
                            <span>{formatBytes(convertDataLimitToUnit(Number(item.dataLimit), DataLimitUnit.MB))}</span>
                        ) : (
                            <InfinityIcon size={20} />
                        )}
                    </>
                )}
            </div>
        </Chip>
    );
}
