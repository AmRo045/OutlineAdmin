"use client";

import { Button, Divider, Input, Link, Tooltip, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { Server } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeftIcon } from "@/src/components/icons";
import { EditServerRequest } from "@/src/core/definitions";
import { removeServer, updateServer } from "@/src/core/actions/server";
import ConfirmModal from "@/src/components/modals/confirm-modal";
import MessageModal from "@/src/components/modals/message-modal";
import { app } from "@/src/core/config";

interface Props {
    server: Server;
}

export default function ServerEditForm({ server }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("return");

    const updateErrorModalDisclosure = useDisclosure();
    const removeServerConfirmModalDisclosure = useDisclosure();

    const [serverError, setServerError] = useState<string>();

    const form = useForm<EditServerRequest>({
        defaultValues: {
            name: server.name,
            hostnameForNewAccessKeys: server.hostnameForNewAccessKeys,
            portForNewAccessKeys: server.portForNewAccessKeys
        }
    });

    const actualSubmit = async (data: EditServerRequest) => {
        try {
            await updateServer(server.id, data);

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                router.push("/servers");
            }
        } catch (error) {
            setServerError((error as object).toString());
            updateErrorModalDisclosure.onOpen();
        }
    };

    const handleRemoveServer = async () => {
        await removeServer(server.id);

        router.push("/servers");
    };

    return (
        <>
            <MessageModal
                body={
                    <div className="grid gap-2">
                        <span>Could not update server. Something went wrong.</span>
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">{serverError}</pre>
                    </div>
                }
                disclosure={updateErrorModalDisclosure}
                title="Server Error!"
            />

            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>Are you sure you want to remove this server?</span>
                        <p className="text-default-500 text-sm">
                            Please note that this action will only remove the server from the {app.name}
                            &apos;s database. The server itself will not be affected.
                        </p>
                    </div>
                }
                confirmLabel="Remove"
                disclosure={removeServerConfirmModalDisclosure}
                title="Remove Server"
                onConfirm={handleRemoveServer}
            />

            <div className="grid gap-6">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Back" delay={600} size="sm">
                        <Button
                            as={Link}
                            href={returnUrl ? returnUrl : "/servers"}
                            isIconOnly={true}
                            size="sm"
                            variant="light"
                        >
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">Server Settings</h1>
                </section>

                <form className="px-10 grid gap-4" onSubmit={form.handleSubmit(actualSubmit)}>
                    <span className="text-lg">Editable Information</span>
                    <Input
                        className="w-[320px]"
                        description="Set a new name for your server. Note that this will not be reflected on the devices of the users that you invited to connect to it"
                        isInvalid={!!form.formState.errors.name}
                        label="Server name"
                        required={true}
                        size="sm"
                        variant="faded"
                        {...form.register("name", {
                            required: true,
                            maxLength: 128
                        })}
                    />

                    <Input
                        className="w-[320px]"
                        description="This will not affect the existing access keys"
                        isInvalid={!!form.formState.errors.hostnameForNewAccessKeys}
                        label="Hostname or IP for new access keys"
                        required={true}
                        size="sm"
                        variant="faded"
                        {...form.register("hostnameForNewAccessKeys", {
                            required: true,
                            maxLength: 128
                        })}
                    />

                    <Input
                        className="w-[320px]"
                        description="This will not affect the existing access keys. Make sure the port is not in use by other programs"
                        isInvalid={!!form.formState.errors.portForNewAccessKeys}
                        label="Port for new access keys (Max: 65535)"
                        required={true}
                        size="sm"
                        type="number"
                        variant="faded"
                        {...form.register("portForNewAccessKeys", {
                            required: true,
                            min: 1,
                            max: 65535,
                            setValueAs: (v: string) => parseInt(v)
                        })}
                    />

                    <Button
                        className="w-fit"
                        color="primary"
                        isLoading={form.formState.isSubmitting || (form.formState.isSubmitSuccessful && !serverError)}
                        type="submit"
                        variant="shadow"
                    >
                        Save
                    </Button>
                </form>

                <Divider />

                <div className="px-10 grid gap-4">
                    <span className="text-lg">Remove The Server</span>
                    <p className="text-default-500 text-sm">
                        Please note that this action will only remove the server from the {app.name}&apos;s database.
                        The server itself will not be affected.
                    </p>
                    <Button
                        className="w-fit"
                        color="danger"
                        variant="shadow"
                        onPress={removeServerConfirmModalDisclosure.onOpen}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </>
    );
}
