import { redirect } from "next/navigation";

import prisma from "@/prisma/db";
import LoginForm from "@/src/components/login-form";
import { ADMIN_PASSWORD_ROUTE } from "@/src/core/config";

export default async function LoginPage() {
    const adminUser = await prisma.user.findFirst();

    if (!adminUser) {
        redirect(ADMIN_PASSWORD_ROUTE);
    }

    return <LoginForm />;
}
