import { JWTPayload } from "jose";
import { Server } from "@prisma/client";

export interface SessionPayload extends JWTPayload {
    userId: number;
}

export interface UserSession {
    isAuthorized: boolean;
    userId: number | undefined;
}

export type ServerWithAccessKeysCount = Server & { _count?: { accessKeys: number } };

export interface NewServerRequest {
    managementJson: string;
    isMetricsEnabled: boolean;
    apiCertSha256: string;
    isAvailable: boolean;
    apiUrl: string;
    portForNewAccessKeys: number;
    hostnameForNewAccessKeys: string;
    name: string;
    apiCreatedAt: Date;
    hostnameOrIp: string;
    version: string;
    apiId: string;
}

export interface EditServerRequest {
    name: string;
    portForNewAccessKeys: number;
    hostnameForNewAccessKeys: string;
}

export enum DataLimitUnit {
    Bytes = "Bytes",
    KB = "KB",
    MB = "MB",
    GB = "GB"
}

export interface NewAccessKeyRequest {
    serverId: number;
    name: string;
    dataLimitUnit: DataLimitUnit;
    dataLimit?: number | null;
    expiresAt?: Date | null;
}

export namespace Outline {
    export interface Server {
        name: string;
        serverId: string;
        metricsEnabled: boolean;
        createdTimestampMs: number;
        version: string;
        portForNewAccessKeys: number;
        hostnameForAccessKeys: string;
    }

    export interface AccessKey {
        id: number;
        name: string;
        password: string;
        port: number;
        method: string;
        accessUrl: string;
        dataLimitInBytes?: number;
    }
}
