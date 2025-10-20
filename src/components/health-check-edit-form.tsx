"use client";

import React, { useState } from "react";
import { HealthCheck } from "@prisma/client";
import { Radio, RadioGroup } from "@heroui/radio";
import { Controller, useForm } from "react-hook-form";
import { addToast, Alert, Button, Input, Link, Textarea, Tooltip, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import { testTelegramNotification, updateHealthCheck } from "@/src/core/actions/health-check";
import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";

interface Props {
    healthCheck: HealthCheck;
}

type FormFields = {
    interval: number;
    notificationType: string;
    notificationCooldown: number;
    telegramBotToken?: string;
    telegramChatId?: string;
    telegramMessageTemplate?: string;
};

export default function HealthCheckEditForm({ healthCheck }: Props) {
    const router = useRouter();

    const parsedConfig = (() => {
        try {
            return healthCheck.notificationConfig ? JSON.parse(healthCheck.notificationConfig) : {};
        } catch {
            return {};
        }
    })();

    const form = useForm<FormFields>({
        defaultValues: {
            interval: healthCheck.interval,
            notificationType: healthCheck.notification ?? "none",
            notificationCooldown: healthCheck.notificationCooldown,
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

    const selectedNotificationType = watch("notificationType");

    const handleTest = async () => {
        const values = getValues();

        try {
            setIsTesting(true);
            const result = await testTelegramNotification({
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
        const notificationType = data.notificationType === "none" ? null : data.notificationType;
        let config = null;

        if (data.notificationType === "telegram") {
            config = JSON.stringify({
                botToken: data.telegramBotToken!,
                chatId: data.telegramChatId!,
                messageTemplate: data.telegramMessageTemplate!
            });
        }

        try {
            await updateHealthCheck({
                id: healthCheck.id,
                notification: notificationType,
                notificationCooldown: data.notificationCooldown,
                interval: data.interval,
                notificationConfig: config
            });

            router.push("/health-checks");
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
            <div className="grid gap-6">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/health-checks" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">Health Check Details</h1>
                </section>

                {selectedNotificationType === "telegram" && (
                    <Alert color="warning" variant="flat">
                        If Telegram is blocked in the region where your server is hosted, you may experience issues
                        sending notifications through the Telegram API. To resolve this, consider using a proxy such as{" "}
                        <Link
                            className="text-warning font-black contents"
                            href={app.links.myTelegramApiProxyWorkerRepo}
                            target="_blank"
                        >
                            Telegram API Proxy via Cloudflare Worker
                        </Link>
                        . You can change the Telegram API base URL in .env file.
                    </Alert>
                )}

                <form className="w-fit grid gap-4" onSubmit={handleSubmit(actualSubmit)}>
                    {/* Interval */}
                    <Input
                        color="primary"
                        description="Time (in minutes) between each server status check"
                        label="Interval"
                        max={10000}
                        min={1}
                        placeholder="e.g. 5"
                        type="number"
                        variant="underlined"
                        {...register("interval", { valueAsNumber: true, required: "Interval is required" })}
                    />
                    {formState.errors.interval && (
                        <span className="text-danger-500 text-sm">{formState.errors.interval.message}</span>
                    )}

                    {/* Notification cooldown */}
                    <Input
                        color="primary"
                        description="Time (in minutes) to wait before sending another notification"
                        label="Notification cooldown"
                        max={10000}
                        min={1}
                        placeholder="e.g. 5"
                        type="number"
                        variant="underlined"
                        {...register("notificationCooldown", {
                            valueAsNumber: true,
                            required: "Notification cooldown is required"
                        })}
                    />
                    {formState.errors.notificationCooldown && (
                        <span className="text-danger-500 text-sm">{formState.errors.notificationCooldown.message}</span>
                    )}

                    {/* Notification type */}
                    <Controller
                        control={control}
                        name="notificationType"
                        render={({ field }) => (
                            <RadioGroup label="Notification type" value={field.value} onChange={field.onChange}>
                                <Radio value="none">None</Radio>
                                <Radio value="telegram">Telegram</Radio>
                            </RadioGroup>
                        )}
                    />

                    {/* Telegram settings */}
                    {selectedNotificationType === "telegram" && (
                        <div className="grid gap-2">
                            <div className="text-sm text-foreground-500 flex justify-between gap-2 items-center">
                                <span>Notification configuration</span>
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

                            <Input
                                color="primary"
                                label="Bot token"
                                placeholder="e.g. 7049328752:AAE20ro04o0XApJ0yuesd12t5e8w41s55ck"
                                variant="underlined"
                                {...register("telegramBotToken", {
                                    required: "Bot token is required"
                                })}
                            />
                            {formState.errors.telegramBotToken && (
                                <span className="text-danger-500 text-sm">
                                    {formState.errors.telegramBotToken.message}
                                </span>
                            )}

                            <Input
                                color="primary"
                                label="Chat ID"
                                placeholder="e.g. 1234401001"
                                variant="underlined"
                                {...register("telegramChatId", { required: "Chat ID is required" })}
                            />
                            {formState.errors.telegramChatId && (
                                <span className="text-danger-500 text-sm">
                                    {formState.errors.telegramChatId.message}
                                </span>
                            )}

                            <Textarea
                                color="primary"
                                description="Available placeholders: {{serverName}} {{serverHostnameOrIp}}"
                                label="Message template"
                                placeholder={`e.g. "{{serverName}} ({{serverHostnameOrIp}})" is out of reach!"`}
                                variant="underlined"
                                {...register("telegramMessageTemplate", {
                                    required: "Message template is required"
                                })}
                            />
                            {formState.errors.telegramMessageTemplate && (
                                <span className="text-danger-500 text-sm">
                                    {formState.errors.telegramMessageTemplate.message}
                                </span>
                            )}
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
