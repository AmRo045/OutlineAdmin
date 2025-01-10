import { redirect } from "next/navigation";
import { Metadata } from "next";

import prisma from "@/prisma/db";
import AdminPasswordForm from "@/src/components/admin-password-form";
import { LOGIN_ROUTE } from "@/src/core/config";
import { createPageTitle } from "@/src/core/utils";

export const metadata: Metadata = {
    title: createPageTitle("Admin User")
};

export default async function AdminUserPage() {
    const adminUser = await prisma.user.findFirst();

    if (adminUser) {
        redirect(LOGIN_ROUTE);
    }

    return <AdminPasswordForm />;
}
