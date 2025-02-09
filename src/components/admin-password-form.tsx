"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";

import { UserPasswordIcon } from "@/src/components/icons";
import { updatePassword } from "@/src/core/actions";

interface FormProps {
    password: string;
}

export default function AdminPasswordForm() {
    const router = useRouter();
    const form = useForm<FormProps>();

    const actualSubmit = async (data: FormProps) => {
        await updatePassword(data.password);
        router.push("/");
    };

    return (
        <form
            className="flex flex-col items-center justify-center gap-2 min-h-[64vh]"
            onSubmit={form.handleSubmit(actualSubmit)}
        >
            <div className="grid gap-4 place-items-center text-default-400">
                <UserPasswordIcon size={124} />
                <p className="text-xl mb-6">You need to set a password for admin user</p>
            </div>

            <Input
                className="w-[264px]"
                color="primary"
                errorMessage={form.formState.errors.password?.message}
                isInvalid={!!form.formState.errors.password}
                label="Password"
                placeholder="Admin user password"
                type="password"
                variant="underlined"
                {...form.register("password", {
                    required: true,
                    maxLength: 64
                })}
            />

            <Button
                className="w-[264px]"
                color="primary"
                isLoading={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                type="submit"
                variant="shadow"
            >
                Save
            </Button>
        </form>
    );
}
