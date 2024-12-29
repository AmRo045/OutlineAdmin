import { JWTPayload } from "jose";
import { DynamicAccessKey, Server } from "@prisma/client";
import { SVGProps } from "react";

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

export type ServerWithAccessKeysCount = Server & { _count?: { accessKeys: number } };

export type DynamicAccessKeyWithAccessKeysCount = DynamicAccessKey & { _count?: { accessKeys: number } };

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
