import { NextResponse } from "next/server";

import { getDynamicAccessKeyByPath } from "@/src/core/actions/dynamic-access-key";
import { getDakExpiryDateBasedOnValidityPeriod } from "@/src/core/utils";
import { DakEndpointService } from "@/src/core/dak-endpoint-service";

interface ContextProps {
    params: { path: string[] };
}

export async function GET(req: Request, context: ContextProps) {
    const path = context.params.path.join("/");
    const dynamicAccessKey = await getDynamicAccessKeyByPath(path);

    if (!dynamicAccessKey)
        return NextResponse.json({ error: { message: "There is no dynamic access key with this path" } });

    const expiryDate = getDakExpiryDateBasedOnValidityPeriod(dynamicAccessKey);

    if (
        (dynamicAccessKey.expiresAt && dynamicAccessKey.expiresAt <= new Date()) ||
        (expiryDate && expiryDate <= new Date())
    ) {
        return NextResponse.json({ error: { message: "The dynamic access key has expired" } });
    }

    const clientIp = (
        req.headers.get("x-forwarded-for") ??
        req.headers.get("x-real-ip") ??
        req.headers.get("x-client-ip") ??
        "127.0.0.1"
    ).split(",")[0];

    const service = new DakEndpointService(dynamicAccessKey);

    return await service.handle(clientIp);
}
