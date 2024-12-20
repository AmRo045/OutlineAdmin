import { redirect } from "next/navigation";

import prisma from "@/prisma/db";
import AdminPasswordForm from "@/components/admin-password-form";

export default async function AdminUserPage() {
    const adminUser = await prisma.user.findFirst();

    if (adminUser) {
        redirect("/");
    }

    return <AdminPasswordForm />;
}
