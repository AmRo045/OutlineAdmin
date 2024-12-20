"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { checkPassword } from "@/core/actions";

interface FormProps {
    password: string;
}

export default function LoginForm() {
    const router = useRouter();
    const form = useForm<FormProps>();

    const actualSubmit = async (data: FormProps) => {
        const result = await checkPassword(data.password);

        if (result) {
            // todo: setup auth related stuff
            router.push("/servers");
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
