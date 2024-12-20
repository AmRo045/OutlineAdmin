import { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
    userId: number;
}
