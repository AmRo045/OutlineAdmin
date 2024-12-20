import { redirect } from "next/navigation";

import prisma from "@/prisma/db";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
    const adminUser = await prisma.user.findFirst();

    if (!adminUser) {
        redirect("/admin");
    }

    return <LoginForm />;
}
