import { DynamicAccessKey } from "@prisma/client";

import { DataLimitUnit } from "@/src/core/definitions";
import { app } from "@/src/core/config";

export const formatAsDuration = (start: Date, end: Date): string => {
    const diff = Math.max(0, end.getTime() - start.getTime());
    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
};

export function getDataLimitUnitFactor(unit: DataLimitUnit): number {
    const unitFactors: Map<DataLimitUnit, number> = new Map([
        [DataLimitUnit.Bytes, 1],
        [DataLimitUnit.KB, 1024],
        [DataLimitUnit.MB, 1000 * 1000],
        [DataLimitUnit.GB, 1000 * 1000 * 1000]
    ]);

    return unitFactors.get(unit) ?? 1;
}

export function convertDataLimitToUnit(value: number, unit: DataLimitUnit): number {
    return value * getDataLimitUnitFactor(unit);
}

export function getCurrentDateAsString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let unitIndex = 0;

    while (bytes >= 1000) {
        bytes /= 1000;
        unitIndex++;
    }

    const value = parseFloat(bytes.toFixed(2));
    const unit = units[unitIndex];

    return `${value} ${unit}`;
}

export function getFormattedDate(data?: Date): string {
    const now = data ?? new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const crc32Table: number[] = (() => {
    const table = [];

    for (let i = 0; i < 256; i++) {
        let c = i;

        for (let j = 0; j < 8; j++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[i] = c;
    }

    return table;
})();

export const crc32 = (str: string): number => {
    let crc = 0 ^ -1;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);

        crc = (crc >>> 8) ^ crc32Table[(crc ^ char) & 0xff];
    }

    return (crc ^ -1) >>> 0;
};

export const createPageTitle = (title?: string) => {
    const appTitle = app.name;

    if (title) {
        return `${title} • ${appTitle}`;
    }

    return appTitle;
};

export const getNotificationChannelTypes = () => {
    return ["None", "Telegram"];
};

export const getDakExpiryDateBasedOnValidityPeriod = (dak: DynamicAccessKey) => {
    return dak.usageStartedAt && dak.validityPeriod
        ? new Date(new Date(dak.usageStartedAt).getTime() + Number(dak.validityPeriod) * 24 * 60 * 60 * 1000)
        : null;
};
