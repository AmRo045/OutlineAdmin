"use client";

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    CheckboxGroup,
    Chip,
    Link,
    Tooltip
} from "@heroui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "@/src/components/icons";
import { DynamicAccessKeyWithAccessKeys, ServerWithAccessKeysAndTags } from "@/src/core/definitions";
import { syncDynamicAccessKeyAccessKeys } from "@/src/core/actions/dynamic-access-key";

interface Props {
    dynamicAccessKey: DynamicAccessKeyWithAccessKeys;
    servers: ServerWithAccessKeysAndTags[];
}

interface FormProps {
    accessKeys: string[];
}

export default function DynamicAccessKeyAccessKeysForm({ dynamicAccessKey, servers }: Props) {
    const router = useRouter();
    const form = useForm<FormProps>({
        defaultValues: {
            accessKeys: dynamicAccessKey.accessKeys.map((k) => k.id.toString())
        }
    });

    const handleSelection = (changes: string[]) => {
        form.setValue("accessKeys", changes, { shouldDirty: true });
    };

    const actualSubmit = async (data: FormProps) => {
        await syncDynamicAccessKeyAccessKeys(
            dynamicAccessKey.id,
            data.accessKeys.map((x) => parseInt(x))
        );

        router.push("/dynamic-access-keys");
    };

    return (
        <>
            <div className="grid gap-6">
                <section className="flex justify-between items-center gap-2">
                    <section className="flex items-center gap-2">
                        <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                            <Button as={Link} href="/dynamic-access-keys" isIconOnly={true} size="sm" variant="light">
                                <ArrowLeftIcon size={20} />
                            </Button>
                        </Tooltip>

                        <h1 className="text-xl">
                            <q>{dynamicAccessKey.name}</q> Access Keys
                        </h1>
                    </section>

                    <form onSubmit={form.handleSubmit(actualSubmit)}>
                        <Button
                            color="primary"
                            isDisabled={!form.formState.isDirty}
                            isLoading={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                            type="submit"
                            variant="shadow"
                        >
                            Save
                        </Button>
                    </form>
                </section>

                <section className="grid gap-6 p-2 xl:px-10">
                    <CheckboxGroup defaultValue={form.getValues("accessKeys")} onChange={handleSelection}>
                        <div className="flex justify-center flex-wrap gap-8">
                            {servers?.map((server) => (
                                <Card key={server.id} className="w-[360px]">
                                    <CardHeader>
                                        <div className="flex gap-2 flex-col w-full">
                                            <span className="text-md">{server.name}</span>
                                            <div className="flex justify-between items-center gap-2">
                                                <Chip size="sm" variant="flat">
                                                    {server.hostnameOrIp}
                                                </Chip>
                                                <Chip
                                                    color={server.isAvailable ? "success" : "danger"}
                                                    size="sm"
                                                    variant="flat"
                                                >
                                                    {server.isAvailable ? "Available" : "Not Available"}
                                                </Chip>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="bg-content2">
                                        {server.accessKeys.map((accessKey) => (
                                            <Checkbox key={accessKey.id} value={accessKey.id.toString()}>
                                                {accessKey.name} ({accessKey.id})
                                            </Checkbox>
                                        ))}
                                    </CardBody>

                                    {server.tags?.length > 0 && (
                                        <CardFooter>
                                            <div className="flex gap-2 items-center flex-wrap">
                                                {server.tags.map((t) => (
                                                    <Chip key={t.tag.id} color="default" size="sm" variant="flat">
                                                        {t.tag.name}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </CardFooter>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </CheckboxGroup>
                </section>
            </div>
        </>
    );
}
