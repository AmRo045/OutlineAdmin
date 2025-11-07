import { Chip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { DynamicAccessKey } from "@prisma/client";

import { InfinityIcon } from "@/src/components/icons";
import { formatAsDuration } from "@/src/core/utils";
import AccessKeyValidityChip from "@/src/components/access-key-validity-chip";

interface Props {
    data: DynamicAccessKey;
}

export default function DynamicAccessKeyValidityChip({ data }: Props) {
    const [duration, setDuration] = useState<string>("...");

    const expiryDate =
        data.usageStartedAt && data.validityPeriod
            ? new Date(new Date(data.usageStartedAt).getTime() + Number(data.validityPeriod) * 24 * 60 * 60 * 1000)
            : null;

    useEffect(() => {
        if (!expiryDate) return;

        const updateDuration = () => {
            setDuration(formatAsDuration(new Date(), expiryDate));
        };

        updateDuration();
        const intervalId = setInterval(updateDuration, 1000);

        return () => clearInterval(intervalId);
    }, [expiryDate]);

    if (data.expiresAt) {
        return <AccessKeyValidityChip value={data.expiresAt} />;
    }

    if (!data.usageStartedAt && data.validityPeriod) {
        return (
            <Chip color="primary" size="sm" variant="flat">
                NOT STARTED
            </Chip>
        );
    }

    if (!data.validityPeriod) {
        return (
            <Chip color="success" size="sm" variant="flat">
                <InfinityIcon />
            </Chip>
        );
    }

    if (expiryDate && expiryDate <= new Date()) {
        return (
            <Chip color="danger" size="sm" variant="flat">
                <span>EXPIRED</span>
            </Chip>
        );
    }

    return (
        <Chip color="warning" size="sm" variant="flat">
            <span>{duration}</span>
        </Chip>
    );
}
