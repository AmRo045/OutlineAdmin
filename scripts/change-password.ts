import bcrypt from "bcrypt";
import prisma from "@/prisma/db";

const updatePassword = async (password: string): Promise<void> => {
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
};

const main = async () => {
    const args = process.argv.slice(2);
    const password = args[0];

    if (!password) {
        console.error("Error: Password is required");
        process.exit(1);
    }

    await updatePassword(password);

    console.log("Password updated successfully.");
};

main().catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
});
