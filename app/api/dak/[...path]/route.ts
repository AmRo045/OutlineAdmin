import { NextResponse } from "next/server";

import { getDynamicAccessKeyByPath } from "@/core/actions/dynamic-access-key";
import { AccessKeyPrefixes } from "@/core/outline/access-key-prefix";

interface ContextProps {
    params: {
        path: string[];
    };
}

export async function GET(req: Request, context: ContextProps) {
    const path = context.params.path.join("/");

    const dynamicAccessKey = await getDynamicAccessKeyByPath(path, true);

    if (!dynamicAccessKey) {
        return NextResponse.json({
            error: {
                message: "There is no dynamic access key with this path"
            }
        });
    }

    if (dynamicAccessKey.expiresAt && dynamicAccessKey.expiresAt <= new Date()) {
        return NextResponse.json({
            error: {
                message: "The dynamic access key has expired"
            }
        });
    }

    if (dynamicAccessKey.accessKeys.length === 0) {
        return NextResponse.json({
            error: {
                message: "There is no assigned access key with this path"
            }
        });
    }

    const clientIp = (
        req.headers.get("x-forwarded-for") ??
        req.headers.get("x-real-ip") ??
        req.headers.get("x-client-ip") ??
        "127.0.0.1"
    ).split(",")[0];

    // todo: selected the access key based on load balancer algorithm

    return NextResponse.json({
        server: "dummy.vpn.ir",
        server_port: 6565,
        password: "password",
        method: "aes",
        prefix: AccessKeyPrefixes[0].jsonEncodedValue
    });
}
