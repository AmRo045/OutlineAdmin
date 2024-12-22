import { Outline } from "@/core/definitions";

interface ApiResponse {
    statusCode: number;
    result?: any;
    message?: string;
    errors?: any[];
}

export default class ApiClient {
    constructor(
        public apiUrl: string,
        public certSha256: string
    ) {}

    static fromConfig(config: string): ApiClient {
        const json = JSON.parse(config) as { apiUrl: string; certSha256: string };

        return new ApiClient(json.apiUrl, json.certSha256);
    }

    async server(): Promise<Outline.Server> {
        const response = await this.fetchWrapper("/server", "GET");

        return await response.json();
    }

    async setHostNameForNewKeys(hostnameOrIpAddress: string): Promise<ApiResponse> {
        const response = await this.fetchWrapper("/server/hostname-for-access-keys", "PUT", {
            hostname: hostnameOrIpAddress
        });

        return await response.json();
    }

    async setServerName(name: string): Promise<ApiResponse> {
        const response = await this.fetchWrapper("/name", "PUT", {
            name
        });

        return await response.json();
    }

    async setPortForNewKeys(port: number): Promise<ApiResponse> {
        const response = await this.fetchWrapper("/server/port-for-new-access-keys", "PUT", {
            port
        });

        return await response.json();
    }

    async metricsTransfer(): Promise<Outline.Metrics> {
        const response = await this.fetchWrapper("/metrics/transfer", "GET");

        return await response.json();
    }

    async keys(): Promise<ApiResponse> {
        const response = await this.fetchWrapper("/access-keys", "GET");

        return await response.json();
    }

    async createKey(): Promise<Outline.AccessKey> {
        const response = await this.fetchWrapper("/access-keys", "POST");

        const data: Outline.AccessKey = await response.json();

        data.name = data.name.length > 0 ? data.name : `Key #${data.id}`;

        return data;
    }

    async renameKey(id: string, name: string): Promise<void> {
        await this.fetchWrapper(`/access-keys/${id}/name`, "PUT", {
            name
        });
    }

    async deleteKey(id: number): Promise<void> {
        await this.fetchWrapper(`/access-keys/${id}`, "DELETE");
    }

    async setDataLimitForKey(id: string, limitInBytes: number): Promise<void> {
        await this.fetchWrapper(`/access-keys/${id}/data-limit`, "PUT", {
            limit: { bytes: limitInBytes }
        });
    }

    async removeDataLimitForKey(id: number): Promise<void> {
        await this.fetchWrapper(`/access-keys/${id}/data-limit`, "DELETE");
    }

    private async fetchWrapper(endpoint: string, method: string, body?: any): Promise<Response> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };

        const options: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        };

        const url = `${this.apiUrl}${endpoint}`;

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
    }
}
