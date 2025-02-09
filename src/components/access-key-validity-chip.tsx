import { Chip } from "@heroui/react";
import React, { useEffect, useState } from "react";

import { InfinityIcon } from "@/src/components/icons";
import { formatAsDuration } from "@/src/core/utils";

interface Props {
    value: Date | null;
}

export default function AccessKeyValidityChip({ value }: Props) {
    const [duration, setDuration] = useState<string>("...");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDuration(formatAsDuration(new Date(), value ?? new Date()));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (!value) {
        return (
            <Chip color="success" size="sm" variant="flat">
                <InfinityIcon />
            </Chip>
        );
    }

    if (value <= new Date()) {
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
