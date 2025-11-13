import { NextResponse } from "next/server";
import { AccessKey, Server } from "@prisma/client";

import prisma from "@/prisma/db";
import {
    DataLimitUnit,
    DynamicAccessKeyApiResponse,
    DynamicAccessKeyWithAccessKeys,
    LoadBalancerAlgorithm
} from "@/src/core/definitions";
import { crc32 } from "@/src/core/utils";
import { createAccessKey } from "@/src/core/actions/access-key";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";

export class DakEndpointService {
    private readonly dak: DynamicAccessKeyWithAccessKeys;

    constructor(dynamicAccessKey: DynamicAccessKeyWithAccessKeys) {
        this.dak = dynamicAccessKey;
    }

    async handle(clientIp: string) {
        if (this.dak.isSelfManaged) {
            return this.handleSelfManaged();
        }

        if (this.dak.accessKeys.length === 0)
            return this.error("There is no associated access key to this dynamic access key");

        const selectedAccessKey = await this.selectAccessKey(clientIp);
        const selectedServer = await prisma.server.findFirstOrThrow({
            where: { id: selectedAccessKey.serverId }
        });

        return this.createResponse(selectedServer, selectedAccessKey);
    }

    private async handleSelfManaged() {
        const dataLimit = this.dak.dataLimit ? Number(this.dak.dataLimit) : 0;
        const bytesPerMB = 1024 * 1024;
        const dataLimitInBytes = dataLimit * bytesPerMB;

        if (dataLimit > 0 && this.dak.dataUsage >= dataLimitInBytes)
            return this.error("The dynamic access key data usage limit exceeded");

        const servers = await this.getAvailableServers();

        if (servers.length === 0) return this.error("Server pool is empty");

        const activeServerId = await this.validateOrSelectServer(servers);

        if (!activeServerId) return this.error("No active server could be selected");

        const accessKeyName = `self-managed-dak-access-key-${this.dak.id}`;

        return this.getOrCreateAccessKeyResponse(accessKeyName, activeServerId);
    }

    private async getAvailableServers(): Promise<Server[]> {
        const poolItems = JSON.parse(this.dak.serverPoolValue ?? "[]");
        const baseWhere = { isAvailable: true };

        switch (this.dak.serverPoolType) {
            case "manual":
                return prisma.server.findMany({
                    where: { ...baseWhere, id: { in: poolItems } }
                });
            case "tag":
                return prisma.server.findMany({
                    where: {
                        ...baseWhere,
                        tags: { some: { tagId: { in: poolItems } } }
                    }
                });
            default:
                return [];
        }
    }

    private async validateOrSelectServer(servers: Server[]): Promise<number | null> {
        const { activeServerId } = this.dak;

        if (activeServerId) {
            const stillAvailable = servers.some((s) => s.id === activeServerId && s.isAvailable);

            if (stillAvailable) return activeServerId;
        }

        return this.setRandomActiveServer(servers);
    }

    private async setRandomActiveServer(servers: Server[]): Promise<number> {
        const randomServer = servers[Math.floor(Math.random() * servers.length)];

        await prisma.dynamicAccessKey.update({
            where: { id: this.dak.id },
            data: { activeServerId: randomServer.id }
        });

        return randomServer.id;
    }

    private async getOrCreateAccessKeyResponse(accessKeyName: string, serverId: number) {
        const server = await prisma.server.findUnique({
            where: { id: serverId, isAvailable: true },
            include: { accessKeys: true }
        });

        if (!server) return this.error("Could not find active server");

        let accessKey = server.accessKeys.find((k) => k.name === accessKeyName);

        if (!accessKey) {
            accessKey = await createAccessKey({
                serverId: server.id,
                name: accessKeyName,
                prefix: null,
                expiresAt: null,
                dataLimit: null,
                dataLimitUnit: DataLimitUnit.MB
            });
        }

        return this.createResponse(server, accessKey);
    }

    private async selectAccessKey(clientIp: string): Promise<AccessKey> {
        const keys = this.dak.accessKeys;

        switch (this.dak.loadBalancerAlgorithm) {
            case LoadBalancerAlgorithm.UserIpAddress:
                return this.selectAccessKeyByClientIp(keys, clientIp);
            case LoadBalancerAlgorithm.RandomServerKeyOnEachConnection:
                return this.selectRandomServerKey(keys);
            case LoadBalancerAlgorithm.RandomKeyOnEachConnection:
            default:
                return keys[Math.floor(Math.random() * keys.length)];
        }
    }

    private selectAccessKeyByClientIp(keys: AccessKey[], clientIp: string): AccessKey {
        const hash = crc32(clientIp);
        const index = hash % keys.length;

        return keys[index];
    }

    private selectRandomServerKey(keys: AccessKey[]): AccessKey {
        const grouped = keys.reduce((map, key) => {
            const list = map.get(key.serverId) ?? [];

            list.push(key);
            map.set(key.serverId, list);

            return map;
        }, new Map<number, AccessKey[]>());

        const serverGroups = Array.from(grouped.values());
        const randomGroup = serverGroups[Math.floor(Math.random() * serverGroups.length)];

        return randomGroup[Math.floor(Math.random() * randomGroup.length)];
    }

    private async createResponse(server: Server, key: AccessKey) {
        if (!this.dak.usageStartedAt) {
            await prisma.dynamicAccessKey.update({
                where: { id: this.dak.id },
                data: { usageStartedAt: new Date() }
            });
        }

        const base: DynamicAccessKeyApiResponse = {
            server: server.hostnameOrIp,
            server_port: key.port,
            password: key.password,
            method: key.method
        };

        if (this.dak.prefix) {
            const prefix = AccessKeyPrefixes.find((x) => x.type === this.dak.prefix);

            if (prefix) return NextResponse.json({ ...base, prefix: prefix.jsonEncodedValue });
        }

        return NextResponse.json(base);
    }

    private error(message: string) {
        return NextResponse.json({ error: { message } });
    }
}
