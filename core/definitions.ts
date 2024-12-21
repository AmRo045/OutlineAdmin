import { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
    userId: number;
}

export interface UserSession {
    isAuthorized: boolean;
    userId: number | undefined;
}
