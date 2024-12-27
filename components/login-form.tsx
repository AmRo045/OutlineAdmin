"use client";

import { useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";

import { checkPassword, login } from "@/core/actions";

interface FormProps {
    password: string;
}

export default function LoginForm() {
    const form = useForm<FormProps>();

    const actualSubmit = async (data: FormProps) => {
        const userId = await checkPassword(data.password);

        if (userId) {
            await login(userId);
        } else {
            form.setError("password", { type: "custom", message: "Incorrect password." });
        }
    };

    return (
        <form
            className="flex flex-col items-center justify-center gap-2 min-h-[64vh]"
            onSubmit={form.handleSubmit(actualSubmit)}
        >
            <Input
                className="w-[264px]"
                color="primary"
                errorMessage={form.formState.errors.password?.message}
                isInvalid={!!form.formState.errors.password}
                label="Password"
                placeholder="Enter your password"
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
                Login
            </Button>
        </form>
    );
}
