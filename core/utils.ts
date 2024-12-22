import { DataLimitUnit } from "@/core/definitions";

export function getDataLimitUnitFactor(unit: DataLimitUnit): number {
    const unitFactors: Map<DataLimitUnit, number> = new Map([
        [DataLimitUnit.Bytes, 1],
        [DataLimitUnit.KB, 1024],
        [DataLimitUnit.MB, 1000 * 1000],
        [DataLimitUnit.GB, 1000 * 1000 * 1000]
    ]);

    return unitFactors.get(unit) ?? 1;
}

export function convertDataLimitToBytes(value: number, unit: DataLimitUnit): number {
    return value * getDataLimitUnitFactor(unit);
}
