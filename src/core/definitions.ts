import { JWTPayload } from "jose";
import { Prisma } from "@prisma/client";
import { SVGProps } from "react";

export enum LoggerContext {
    OutlineSyncJob = "outline-sync-job",
    HealthCheckJob = "health-check-job"
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

export type ServerWithAccessKeys = Prisma.ServerGetPayload<{
    include: {
        accessKeys: true;
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
    expiresAt?: Date | null;
    prefix?: string | null;
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
}
