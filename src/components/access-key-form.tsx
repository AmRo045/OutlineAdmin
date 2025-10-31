"use client";

import { AccessKey } from "@prisma/client";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    Button,
    Chip,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Link,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { AccessKeyPrefixType, DataLimitUnit, EditAccessKeyRequest, NewAccessKeyRequest } from "@/src/core/definitions";
import { createAccessKey, updateAccessKey } from "@/src/core/actions/access-key";
import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon, DeleteIcon } from "@/src/components/icons";
import CustomDatePicker from "@/src/components/custom-date-picker";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import { syncServer } from "@/src/core/actions/server";
import { MAX_DATA_LIMIT_FOR_ACCESS_KEYS } from "@/src/core/config";

interface Props {
    serverId: number;
    accessKeyData?: AccessKey | null;
}

export default function AccessKeyForm({ serverId, accessKeyData }: Props) {
    const router = useRouter();
    const form = useForm<NewAccessKeyRequest | EditAccessKeyRequest>({
        defaultValues: accessKeyData
            ? {
                  serverId: accessKeyData.serverId,
                  name: accessKeyData.name,
                  dataLimit: Number(accessKeyData.dataLimit),
                  expiresAt: accessKeyData.expiresAt,
                  prefix: accessKeyData.prefix
              }
            : {
                  serverId: serverId,
                  name: "",
                  dataLimit: null,
                  expiresAt: null,
                  prefix: null
              }
    });
    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();

    const [selectedExpirationDate, setSelectedExpirationDate] = useState<string>();
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewAccessKeyRequest | EditAccessKeyRequest) => {
        setErrorMessage(() => "");

        try {
            data.serverId ??= serverId;
            data.dataLimitUnit = DataLimitUnit.MB;

            if (accessKeyData) {
                const updateData = data as EditAccessKeyRequest;

                updateData.id = accessKeyData.id;
                await updateAccessKey(updateData);
            } else {
                console.log(data);
                await createAccessKey(data);
            }

            await syncServer(serverId);

            router.push(`/servers/${serverId}/access-keys`);
        } catch (error) {
            setErrorMessage(() => (error as object).toString());
        }
    };

    useEffect(() => {
        let value = null;

        if (selectedExpirationDate) {
            value = moment(selectedExpirationDate, "YYYY-MM-DD").toDate();
        }

        form.setValue("expiresAt", value, { shouldDirty: true });
    }, [selectedExpirationDate]);

    useEffect(() => {
        form.setValue("prefix", selectedPrefix, { shouldDirty: true });
    }, [selectedPrefix]);

    useEffect(() => {
        if (accessKeyData) {
            if (accessKeyData.expiresAt) {
                setSelectedExpirationDate(moment(accessKeyData.expiresAt).format("YYYY-MM-DD"));
            } else {
                setSelectedExpirationDate(undefined);
            }

            setSelectedPrefix(accessKeyData.prefix);
        } else {
            setSelectedExpirationDate(undefined);
            setSelectedPrefix(null);
        }
    }, [accessKeyData]);

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
                    <Tooltip closeDelay={100} color="default" content="Access keys" delay={600} size="sm">
                        <Button
                            isIconOnly
                            as={Link}
                            href={`/servers/${serverId}/access-keys`}
                            size="sm"
                            variant="light"
                        >
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">
                        {accessKeyData ? ` Access Key "${accessKeyData.name}"` : "New  Access Key"}
                    </h1>
                </section>

                <form className="grid gap-4 w-full max-w-[464px]" onSubmit={form.handleSubmit(actualSubmit)}>
                    <Input
                        errorMessage={form.formState.errors.name?.message}
                        isInvalid={!!form.formState.errors.name}
                        label="Access key name"
                        size="sm"
                        variant="underlined"
                        {...form.register("name", {
                            required: "Name is required",
                            maxLength: {
                                value: 64,
                                message: "The name cannot be more than 64 character"
                            }
                        })}
                    />

                    <div className="flex gap-2">
                        <Input
                            endContent={<span>MB</span>}
                            errorMessage={form.formState.errors.dataLimit?.message}
                            isInvalid={!!form.formState.errors.dataLimit}
                            label="Data limit"
                            size="sm"
                            type="number"
                            variant="underlined"
                            {...form.register("dataLimit", {
                                required: false,
                                min: 0,
                                max: {
                                    value: MAX_DATA_LIMIT_FOR_ACCESS_KEYS,
                                    message: `The value cannot be more that ${MAX_DATA_LIMIT_FOR_ACCESS_KEYS}`
                                },
                                setValueAs: (v) => parseInt(v)
                            })}
                        />
                    </div>

                    <div className="flex gap-2">
                        {selectedExpirationDate && (
                            <Button
                                color="danger"
                                isIconOnly={true}
                                radius="sm"
                                size="lg"
                                variant="faded"
                                onPress={() => setSelectedExpirationDate(undefined)}
                            >
                                <DeleteIcon size={18} />
                            </Button>
                        )}

                        <CustomDatePicker
                            label="Expiration Date:"
                            value={selectedExpirationDate}
                            onChange={(value) => setSelectedExpirationDate(value)}
                        />
                    </div>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="bg-default-100 text-sm"
                                radius="sm"
                                size="lg"
                                type="button"
                                variant="ghost"
                            >
                                {selectedPrefix ? `Selected prefix: ${selectedPrefix}` : "Prefix"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            defaultSelectedKeys={selectedPrefix ? new Set([selectedPrefix]) : undefined}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(v) => setSelectedPrefix(v.currentKey!)}
                        >
                            {AccessKeyPrefixes.map((prefix) => (
                                <DropdownItem key={prefix.type === AccessKeyPrefixType.None ? "" : prefix.type}>
                                    {prefix.type}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    {selectedPrefix && (
                        <div className="grid gap-2">
                            <Divider className="opacity-65" />
                            <span>Prefix recommended ports:</span>
                            <div className="flex flex-wrap gap-2 rounded-xl p-4 bg-content2">
                                {AccessKeyPrefixes.find(
                                    (x) => x.type.toString() === selectedPrefix
                                )!.recommendedPorts.map((port) => (
                                    <Chip key={port.number} color="secondary" size="sm" variant="flat">
                                        {port.number} ({port.description})
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        color="primary"
                        isLoading={!errorMessage && (form.formState.isSubmitting || form.formState.isSubmitSuccessful)}
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
