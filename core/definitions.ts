import { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
    userId: number;
}

export interface UserSession {
    isAuthorized: boolean;
    userId: number | undefined;
}

export interface NewServerRequest {
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
}
