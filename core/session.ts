import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { SessionPayload } from "@/core/definitions";
import { authSessionKey } from "@/core/config";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload> {
    const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"]
    });

    return payload as SessionPayload;
}

export async function createSession(userId: number) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [session, cookieStore] = await Promise.all([encrypt({ userId, expiresAt }), cookies()]);

    cookieStore.set(authSessionKey, session, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/"
    });
}

export async function refreshSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(authSessionKey)?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    cookieStore.set(authSessionKey, session, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/"
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();

    cookieStore.delete(authSessionKey);
}
