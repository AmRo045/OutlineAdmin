import { Chip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { DynamicAccessKey } from "@prisma/client";

import { InfinityIcon } from "@/src/components/icons";
import { formatAsDuration, getDakExpiryDateBasedOnValidityPeriod } from "@/src/core/utils";
import AccessKeyValidityChip from "@/src/components/access-key-validity-chip";
import { DynamicAccessKeyStats } from "@/src/core/definitions";

interface Props {
    dak: DynamicAccessKey | DynamicAccessKeyStats;
}

export default function DynamicAccessKeyValidityChip({ dak }: Props) {
    const [duration, setDuration] = useState<string>("...");

    const expiryDate = getDakExpiryDateBasedOnValidityPeriod(dak);

    useEffect(() => {
        if (!expiryDate) return;

        const updateDuration = () => {
            setDuration(formatAsDuration(new Date(), expiryDate));
        };

        updateDuration();
        const intervalId = setInterval(updateDuration, 1000);

        return () => clearInterval(intervalId);
    }, [expiryDate]);

    if (dak.expiresAt) {
        return <AccessKeyValidityChip value={dak.expiresAt} />;
    }

    if (!dak.usageStartedAt && dak.validityPeriod) {
        return (
            <Chip color="primary" radius="sm" size="sm" variant="flat">
                NOT STARTED
            </Chip>
        );
    }

    if (!dak.validityPeriod) {
        return (
            <Chip color="success" radius="sm" size="sm" variant="flat">
                <InfinityIcon />
            </Chip>
        );
    }

    if (expiryDate && expiryDate <= new Date()) {
        return (
            <Chip color="danger" radius="sm" size="sm" variant="flat">
                <span>EXPIRED</span>
            </Chip>
        );
    }

    return (
        <Chip color="warning" radius="sm" size="sm" variant="flat">
            <span>{duration}</span>
        </Chip>
    );
}
