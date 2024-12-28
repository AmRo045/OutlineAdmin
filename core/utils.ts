import moment from "moment";

import { DataLimitUnit } from "@/core/definitions";

export const formatAsDuration = (start: Date, end: Date): string => {
    const momentStart = moment(start);
    const momentEnd = moment(end);

    const duration = moment.duration(momentEnd.diff(momentStart));

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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
    const month = ("0" + date.getMonth()).slice(-2);
    const day = ("0" + date.getDay()).slice(-2);

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
