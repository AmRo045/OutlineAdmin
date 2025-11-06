"use server";

import { revalidatePath } from "next/cache";
import { Tag } from "@prisma/client";

import prisma from "@/prisma/db";

export async function createTag(data: any): Promise<void> {
    await prisma.tag.create({ data });

    revalidatePath("/tags");
}

export async function getTags(filters?: { term?: string; skip?: number; take?: number }): Promise<Tag[]> {
    const { term, skip = 0, take = 10 } = filters || {};

    return prisma.tag.findMany({
        where: term ? { name: { contains: term } } : undefined,
        skip,
        take,
        orderBy: [{ id: "desc" }]
    });
}

export async function getTagsCount(filters?: { term?: string }): Promise<number> {
    const { term } = filters || {};

    if (term) {
        return prisma.tag.count({
            where: term ? { name: { contains: term } } : undefined
        });
    }

    return prisma.tag.count();
}

export async function getTagById(id: number) {
    return prisma.tag.findUnique({
        where: { id }
    });
}

export async function updateTag(data: any): Promise<void> {
    const { id, ...updateData } = data; // remove id

    await prisma.tag.update({
        where: { id },
        data: updateData
    });

    revalidatePath("/notification-channels");
    revalidatePath(`/notification-channels/${id}`);
}

export async function deleteTag(id: number): Promise<void> {
    await prisma.tag.delete({
        where: { id }
    });

    revalidatePath("/notification-channels");
    revalidatePath(`/notification-channels/${id}`);
}
