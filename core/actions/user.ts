"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

import prisma from "@/prisma/db";
import { createSession, deleteSession } from "@/core/session";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/core/config";

export async function updatePassword(password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.findFirst();

    if (adminUser) {
        await prisma.user.update({
            where: { id: adminUser.id },
            data: {
                password: hashedPassword
            }
        });
    } else {
        await prisma.user.create({
            data: {
                password: hashedPassword
            }
        });
    }
}

export async function checkPassword(password: string): Promise<number | null> {
    const adminUser = await prisma.user.findFirst();

    if (!adminUser) return null;

    const result = await bcrypt.compare(password, adminUser.password);

    return result ? adminUser.id : null;
}

export async function login(userId: number, redirectTo?: string): Promise<void> {
    await createSession(userId);

    redirect(redirectTo ?? HOME_ROUTE);
}

export async function logout(): Promise<void> {
    await deleteSession();

    redirect(LOGIN_ROUTE);
}
