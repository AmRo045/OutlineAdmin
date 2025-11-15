import { JWTPayload } from "jose";
import { Prisma } from "@prisma/client";
import { SVGProps } from "react";

export enum LoggerContext {
    OutlineSyncJob = "outline-sync-job",
    HealthCheckJob = "health-check-job",
    DakJob = "dak-job"
}

export enum HealthCheckNotificationType {
    Telegram = "Telegram"
}

export type TelegramNotificationChannelConfig = {
    apiUrl: string;
    botToken: string;
    chatId: string;
    messageTemplate: string;
};

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface SessionPayload extends JWTPayload {
    userId: number;
}

export interface UserSession {
    isAuthorized: boolean;
    userId: number | undefined;
}

export type ServerWithAccessKeysCount = Prisma.ServerGetPayload<{
    include: {
        _count: {
            select: { accessKeys: true };
        };
    };
}>;

export type ServerWithAccessKeysCountAndTags = Prisma.ServerGetPayload<{
    include: {
        _count: {
            select: { accessKeys: true };
        };
        tags: {
            include: { tag: true };
        };
    };
}>;

export type ServerWithAccessKeys = Prisma.ServerGetPayload<{
    include: {
        accessKeys: true;
    };
}>;

export type ServerWithAccessKeysAndTags = Prisma.ServerGetPayload<{
    include: {
        accessKeys: true;
        tags: {
            include: { tag: true };
        };
    };
}>;

export type ServerWithTags = Prisma.ServerGetPayload<{
    include: {
        tags: {
            include: { tag: true };
        };
    };
}>;

export type ServerWithHealthCheck = Prisma.ServerGetPayload<{
    include: {
        healthCheck: true;
    };
}>;

export type DynamicAccessKeyWithAccessKeysCount = Prisma.DynamicAccessKeyGetPayload<{
    include: {
        _count: {
            select: { accessKeys: true };
        };
    };
}>;

export type DynamicAccessKeyWithAccessKeys = Prisma.DynamicAccessKeyGetPayload<{
    include: {
        accessKeys: true;
    };
}>;

export type HealthCheckWithServerAndChannel = Prisma.HealthCheckGetPayload<{
    include: {
        server: true;
        notificationChannel: true;
    };
}>;

export interface NewServerRequest {
    managementJson: string;
}

export interface EditServerRequest {
    name: string;
    portForNewAccessKeys: number;
    hostnameForNewAccessKeys: string;
    tags: string[];
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
    dataLimit?: BigInt | null;
    expiresAt?: Date | null;
    prefix?: string | null;
}

export interface EditAccessKeyRequest extends NewAccessKeyRequest {
    id: number;
}

export enum AccessKeyPrefixType {
    None = "None",
    HttpRequest = "HttpRequest",
    HttpResponse = "HttpResponse",
    DnsOverTcpRequest = "DnsOverTcpRequest",
    TlsClientHello = "TlsClientHello",
    TlsServerHello = "TlsServerHello",
    TlsApplicationData = "TlsApplicationData",
    Ssh = "Ssh"
}

export enum LoadBalancerAlgorithm {
    UserIpAddress = "UserIpAddress",
    RandomKeyOnEachConnection = "RandomKeyOnEachConnection",
    RandomServerKeyOnEachConnection = "RandomServerKeyOnEachConnection"
}

export interface NewDynamicAccessKeyRequest {
    name: string;
    path: string;
    loadBalancerAlgorithm: string;
    isSelfManaged: boolean;
    serverPoolValue: string | null;
    serverPoolType: string | null;
    validityPeriod: string | null;
    setUsageDateOnFirstConnection?: boolean;
    dataLimit: number | null;
    expiresAt: Date | null;
    prefix: string | null;
}

export interface EditDynamicAccessKeyRequest extends NewDynamicAccessKeyRequest {
    id: number;
}

export interface AccessKeyPrefixData {
    type: AccessKeyPrefixType;
    jsonEncodedValue: string;
    urlEncodedValue: string;
    recommendedPorts: { number: number; description: string }[];
}

export interface DynamicAccessKeyApiResponse {
    server: string;
    server_port: number;
    password: string;
    method: string;
    prefix?: string;
    error?: {
        message?: string;
    };
}

export interface UpdateHealthCheckRequest {
    id: number;
    notificationChannelId?: number | null;
    notificationCooldown: number;
    interval: number;
}

export interface DynamicAccessKeyStats {
    name: string;
    path: string;
    expiresAt: Date | null;
    validityPeriod: string | null;
    dataLimit: number | null;
    dataUsage: number;
    usageStartedAt: Date | null;
    prefix: string | null;
    isSelfManaged: boolean;
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

    export interface Metrics {
        bytesTransferredByUserId: { [id: string]: number };
    }

    export interface AccessKey {
        id: string;
        name: string;
        password: string;
        port: number;
        method: string;
        accessUrl: string;
        dataLimitInBytes?: number;
    }

    export namespace Experimental {
        export interface DataTransferred {
            bytes: number;
        }

        export interface TunnelTime {
            seconds: number;
        }

        export interface BandwidthData {
            data: DataTransferred;
            timestamp: number;
        }

        export interface Bandwidth {
            current: BandwidthData;
            peak: BandwidthData;
        }

        export interface LocationData {
            location: string;
            asn: number | null;
            asOrg: string | null;
            dataTransferred: DataTransferred;
            tunnelTime: TunnelTime;
        }

        export interface ServerMetrics {
            tunnelTime: TunnelTime;
            dataTransferred: DataTransferred;
            bandwidth: Bandwidth;
            locations: LocationData[];
        }

        export interface PeakDeviceCount {
            data: number;
            timestamp: number | null;
        }

        export interface Connection {
            lastTrafficSeen: number | null;
            peakDeviceCount: PeakDeviceCount;
        }

        export interface AccessKey {
            accessKeyId: number;
            dataTransferred: DataTransferred;
            tunnelTime: TunnelTime;
            connection: Connection;
        }

        export interface Metrics {
            server: ServerMetrics;
            accessKeys: AccessKey[];
        }
    }
}
