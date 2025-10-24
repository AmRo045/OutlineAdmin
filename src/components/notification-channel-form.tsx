"use client";

import React, { useState } from "react";
import { NotificationChannel } from "@prisma/client";
import { Radio, RadioGroup } from "@heroui/radio";
import { Controller, useForm } from "react-hook-form";
import { addToast, Alert, Button, Input, Link, Textarea, Tooltip, useDisclosure } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";
import {
    createNotificationChannel,
    testTelegramNotificationChannel,
    updateNotificationChannel
} from "@/src/core/actions/notification-channel";
import { getNotificationChannelTypes } from "@/src/core/utils";

interface Props {
    channel?: NotificationChannel;
}

type FormFields = {
    name: string;
    type: string;
    telegramApiUrl?: string;
    telegramBotToken?: string;
    telegramChatId?: string;
    telegramMessageTemplate?: string;
};

export default function NotificationChannelForm({ channel }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const parsedConfig = (() => {
        if (!channel) {
            return {};
        }

        try {
            return channel.config ? JSON.parse(channel.config) : {};
        } catch {
            return {};
        }
    })();

    const form = useForm<FormFields>({
        defaultValues: {
            name: channel?.name,
            type: channel?.type,
            telegramBotToken: parsedConfig.botToken ?? "",
            telegramChatId: parsedConfig.chatId ?? "",
            telegramMessageTemplate: parsedConfig.messageTemplate ?? ""
        },
        shouldUnregister: false
    });

    const { register, handleSubmit, formState, watch, control, getValues } = form;

    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isTesting, setIsTesting] = useState<boolean>(false);

    const selectedType = watch("type");

    const handleTest = async () => {
        const values = getValues();

        try {
            setIsTesting(true);
            const result = await testTelegramNotificationChannel({
                apiUrl: values.telegramApiUrl!,
                botToken: values.telegramBotToken!,
                chatId: values.telegramChatId!,
                messageTemplate: values.telegramMessageTemplate!
            });

            if (result.ok) {
                addToast({
                    title: "Success",
                    description: result.message,
                    color: "success"
                });
            } else {
                setErrorMessage(result.message);
                errorModalDisclosure.onOpen();
            }
        } catch (error) {
            setErrorMessage((error as object).toString());
            errorModalDisclosure.onOpen();
        } finally {
            setIsTesting(false);
        }
    };

    const actualSubmit = async (data: FormFields) => {
        const type = data.type ?? "None";
        let config = null;

        if (data.type === "Telegram") {
            config = JSON.stringify({
                apiUrl: data.telegramApiUrl!,
                botToken: data.telegramBotToken!,
                chatId: data.telegramChatId!,
                messageTemplate: data.telegramMessageTemplate!
            });
        }

        try {
            if (channel) {
                await updateNotificationChannel({
                    id: channel.id,
                    type: type,
                    name: data.name,
                    config
                });
            } else {
                await createNotificationChannel({
                    type: type,
                    name: data.name,
                    config
                });
            }

            const returnUrl = searchParams.get("return");

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                router.push("/notification-channels");
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
                    <Tooltip closeDelay={100} color="default" content="Notification channels" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/notification-channels" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">{channel ? "Edit Notification Channel" : "New Notification Channel"}</h1>
                </section>

                <form className="w-full max-w-[464px] grid gap-4" onSubmit={handleSubmit(actualSubmit)}>
                    <Input
                        color="primary"
                        errorMessage={formState.errors.name?.message}
                        isInvalid={!!formState.errors.name}
                        label="Channel name"
                        placeholder="e.g. My Telegram"
                        variant="underlined"
                        {...register("name", {
                            required: "The name is required"
                        })}
                    />

                    <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <RadioGroup
                                defaultValue={channel?.type ?? "None"}
                                label="Notification type"
                                value={field.value}
                                onChange={field.onChange}
                            >
                                {getNotificationChannelTypes().map((channel) => (
                                    <Radio key={channel} value={channel}>
                                        {channel}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    {/* Telegram settings */}
                    {selectedType === "Telegram" && (
                        <div className="grid gap-2">
                            <div className="text-sm text-foreground-500 flex justify-between gap-2 items-center">
                                <span>Configuration</span>
                                <Button
                                    isDisabled={formState.isSubmitting || formState.isSubmitSuccessful}
                                    isLoading={isTesting}
                                    size="sm"
                                    variant="light"
                                    onPress={handleTest}
                                >
                                    Test
                                </Button>
                            </div>

                            <div>
                                {selectedType === "Telegram" && (
                                    <Alert color="warning" variant="flat">
                                        If Telegram is blocked in the region where your server is hosted, you may
                                        experience issues sending notifications through the Telegram API. To resolve
                                        this, consider using a proxy such as{" "}
                                        <Link
                                            className="text-warning font-black contents"
                                            href={app.links.myTelegramApiProxyWorkerRepo}
                                            target="_blank"
                                        >
                                            Telegram API Proxy via Cloudflare Worker
                                        </Link>
                                        .
                                    </Alert>
                                )}
                                <Input
                                    color="primary"
                                    defaultValue="https://api.telegram.org"
                                    errorMessage={formState.errors.telegramApiUrl?.message}
                                    isInvalid={!!formState.errors.telegramApiUrl}
                                    label="Telegram API URL"
                                    placeholder="e.g. https://api.telegram.org"
                                    variant="underlined"
                                    {...register("telegramApiUrl", {
                                        required: "API URL is required",
                                        setValueAs: (v) => v?.replace(/\/+$/, "")
                                    })}
                                />
                            </div>

                            <Input
                                color="primary"
                                errorMessage={formState.errors.telegramBotToken?.message}
                                isInvalid={!!formState.errors.telegramBotToken}
                                label="Bot token"
                                placeholder="e.g. 7049328752:AAE20ro04o0XApJ0yuesd12t5e8w41s55ck"
                                variant="underlined"
                                {...register("telegramBotToken", {
                                    required: "Bot token is required"
                                })}
                            />
                            <Input
                                color="primary"
                                errorMessage={formState.errors.telegramChatId?.message}
                                isInvalid={!!formState.errors.telegramChatId}
                                label="Chat ID"
                                placeholder="e.g. 1234401001"
                                variant="underlined"
                                {...register("telegramChatId", { required: "Chat ID is required" })}
                            />

                            <Textarea
                                color="primary"
                                description="Available placeholders: {{serverName}} {{serverHostnameOrIp}}"
                                errorMessage={formState.errors.telegramMessageTemplate?.message}
                                isInvalid={!!formState.errors.telegramMessageTemplate}
                                label="Message template"
                                placeholder={`e.g. "{{serverName}} ({{serverHostnameOrIp}})" is out of reach!`}
                                variant="underlined"
                                {...register("telegramMessageTemplate", {
                                    required: "Message template is required"
                                })}
                            />
                        </div>
                    )}

                    <Button
                        color="primary"
                        isDisabled={isTesting}
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
