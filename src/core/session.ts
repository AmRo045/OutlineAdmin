import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { SessionPayload, UserSession } from "@/src/core/definitions";
import { AUTH_SESSION_KEY } from "@/src/core/config";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"]
        });

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return null;
        }

        return payload as SessionPayload;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
}

export async function createSession(userId: number): Promise<void> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [session, cookieStore] = await Promise.all([encrypt({ userId, expiresAt }), cookies()]);

    cookieStore.set(AUTH_SESSION_KEY, session, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: false, // TODO: fix this
        expires: expiresAt,
        sameSite: "lax",
        path: "/"
    });
}

export async function refreshSession(): Promise<void> {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_SESSION_KEY)?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    cookieStore.set(AUTH_SESSION_KEY, session, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: false, // TODO: fix this
        expires: expiresAt,
        sameSite: "lax",
        path: "/"
    });
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(AUTH_SESSION_KEY);
}

export async function currentSession(): Promise<UserSession> {
    const cookie = (await cookies()).get(AUTH_SESSION_KEY)?.value;
    const session = await decrypt(cookie);
    const userId = session?.userId;

    return { isAuthorized: !!userId, userId };
}
