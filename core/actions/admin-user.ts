"use server";

import bcrypt from "bcrypt";

import prisma from "@/prisma/db";

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

export async function checkPassword(password: string): Promise<boolean> {
    const adminUser = await prisma.user.findFirst();

    if (!adminUser) return false;

    return bcrypt.compare(password, adminUser.password);
}
