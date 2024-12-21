import { redirect } from "next/navigation";

import prisma from "@/prisma/db";
import AdminPasswordForm from "@/components/admin-password-form";
import { LOGIN_ROUTE } from "@/core/config";

export default async function AdminUserPage() {
    const adminUser = await prisma.user.findFirst();

    if (adminUser) {
        redirect(LOGIN_ROUTE);
    }

    return <AdminPasswordForm />;
}
