"use client";

import { Button, Input, Link, Snippet, Tab, Tabs, Tooltip, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "@/src/components/icons";
import { NewServerRequest } from "@/src/core/definitions";
import { createServer } from "@/src/core/actions/server";
import { app } from "@/src/core/config";
import MessageModal from "@/src/components/modals/message-modal";

export default function ServerAddForm() {
    const router = useRouter();
    const updateErrorModalDisclosure = useDisclosure();
    const form = useForm<NewServerRequest>();

    const [serverError, setServerError] = useState<string>();

    const actualSubmit = async (data: NewServerRequest) => {
        try {
            await createServer(data);

            router.push("/servers");
        } catch (error) {
            setServerError((error as object).toString());
            updateErrorModalDisclosure.onOpen();
        }
    };

    return (
        <>
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <span>Could not add server. Something went wrong.</span>
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">{serverError}</pre>
                    </div>
                }
                disclosure={updateErrorModalDisclosure}
                title="Server Error!"
            />

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
                                <p className="text-sm text-default-500">
                                    Log into your VPN server and run this command
                                </p>
                                <Snippet
                                    classNames={{
                                        pre: "!whitespace-pre-line"
                                    }}
                                    color="default"
                                    variant="flat"
                                >
                                    {app.snippets.newOutlineServer}
                                </Snippet>
                            </div>
                        </Tab>

                        <Tab title="Existing Server">
                            <div className="grid gap-2">
                                <p className="text-sm text-default-500">
                                    Log into your VPN server and run this command
                                </p>
                                <Snippet
                                    classNames={{
                                        pre: "!whitespace-pre-line"
                                    }}
                                    color="default"
                                    variant="flat"
                                >
                                    {app.snippets.existingServer}
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
                            placeholder={app.snippets.exampleServerManagementJson}
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
                                isLoading={
                                    form.formState.isSubmitting || (form.formState.isSubmitSuccessful && !serverError)
                                }
                                type="submit"
                                variant="shadow"
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}
