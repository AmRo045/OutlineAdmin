"use client";

import React, { useState } from "react";
import { Tag } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Button, Input, Link, Tooltip, useDisclosure } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon } from "@/src/components/icons";
import { createTag, updateTag } from "@/src/core/actions/tags";

interface Props {
    tag?: Tag;
}

type FormFields = {
    name: string;
};

export default function TagForm({ tag }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<FormFields>({
        defaultValues: {
            name: tag?.name
        },
        shouldUnregister: false
    });

    const { register, handleSubmit, formState } = form;

    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();

    const actualSubmit = async (data: FormFields) => {
        try {
            if (tag) {
                await updateTag({
                    id: tag.id,
                    name: data.name
                });
            } else {
                await createTag({
                    name: data.name
                });
            }

            const returnUrl = searchParams.get("return");

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                router.push("/tags");
            }
        } catch (error) {
            setErrorMessage((error as object).toString());
            errorModalDisclosure.onOpen();
        }
    };

    return (
        <>
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">{errorMessage}</pre>
                    </div>
                }
                disclosure={errorModalDisclosure}
                title="Error!"
            />
            <div className="grid gap-6 w-full">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Tags" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/tags" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">{tag ? "Edit Tag" : "New Tag"}</h1>
                </section>

                <form className="w-full max-w-[464px] grid gap-4" onSubmit={handleSubmit(actualSubmit)}>
                    <Input
                        color="primary"
                        errorMessage={formState.errors.name?.message}
                        isInvalid={!!formState.errors.name}
                        label="Name"
                        placeholder="e.g. Irancell"
                        variant="underlined"
                        {...register("name", {
                            required: "The name is required"
                        })}
                    />

                    <Button
                        color="primary"
                        isLoading={formState.isSubmitting || formState.isSubmitSuccessful}
                        type="submit"
                        variant="shadow"
                    >
                        Save
                    </Button>
                </form>
            </div>
        </>
    );
}
