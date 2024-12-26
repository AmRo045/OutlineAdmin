"use client";

import React from "react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Snippet, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { createServer } from "@/core/actions/server";
import { NewServerRequest } from "@/core/definitions";

export default function AddServerPage() {
    const router = useRouter();
    const form = useForm<NewServerRequest>();

    const actualSubmit = async (data: NewServerRequest) => {
        await createServer(data);

        router.push("/servers");
    };

    return (
        <div className="grid gap-6">
            <section className="flex justify-start items-center gap-2">
                <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                    <Button as={Link} href="/servers" isIconOnly={true} size="sm" variant="light">
                        <ArrowLeftIcon size={20} />
                    </Button>
                </Tooltip>

                <h1 className="text-xl">Add Outline Server</h1>
            </section>

            <section className="px-10 grid gap-2">
                <Tabs>
                    <Tab title="New Server">
                        <div className="grid gap-2">
                            <p className="text-sm text-default-500">Log into your VPN server and run this command</p>
                            <Snippet
                                classNames={{
                                    pre: "!whitespace-pre-line"
                                }}
                                color="default"
                                variant="flat"
                            >
                                {siteConfig.snippets.newOutlineServer}
                            </Snippet>
                        </div>
                    </Tab>

                    <Tab title="Existing Server">
                        <div className="grid gap-2">
                            <p className="text-sm text-default-500">Log into your VPN server and run this command</p>
                            <Snippet
                                classNames={{
                                    pre: "!whitespace-pre-line"
                                }}
                                color="default"
                                variant="flat"
                            >
                                {siteConfig.snippets.existingServer}
                            </Snippet>
                        </div>
                    </Tab>
                </Tabs>
            </section>

            <section className="px-10 grid gap-2">
                <form className="grid gap-4" onSubmit={form.handleSubmit(actualSubmit)}>
                    <Input
                        color="primary"
                        label="Paste your installation output here"
                        placeholder={siteConfig.snippets.exampleServerManagementJson}
                        required={true}
                        variant="faded"
                        {...form.register("managementJson", {
                            required: true,
                            maxLength: 512
                        })}
                    />

                    <div className="flex gap-2 justify-end">
                        <Button
                            className="w-fit"
                            color="primary"
                            isLoading={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                            type="submit"
                            variant="shadow"
                        >
                            Add
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
