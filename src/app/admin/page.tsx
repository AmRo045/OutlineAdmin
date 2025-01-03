import { redirect } from "next/navigation";

import prisma from "@/prisma/db";
import AdminPasswordForm from "@/src/components/admin-password-form";
import { LOGIN_ROUTE } from "@/src/core/config";

export default async function AdminUserPage() {
    const adminUser = await prisma.user.findFirst();

    if (adminUser) {
        redirect(LOGIN_ROUTE);
    }

    return <AdminPasswordForm />;
}
