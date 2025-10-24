"use client";

import { DynamicAccessKey } from "@prisma/client";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
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

import {
    AccessKeyPrefixType,
    EditDynamicAccessKeyRequest,
    LoadBalancerAlgorithm,
    NewDynamicAccessKeyRequest
} from "@/src/core/definitions";
import { createDynamicAccessKey, updateDynamicAccessKey } from "@/src/core/actions/dynamic-access-key";
import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon, DeleteIcon } from "@/src/components/icons";
import CustomDatePicker from "@/src/components/custom-date-picker";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";

interface Props {
    dynamicAccessKey?: DynamicAccessKey | null;
}

export default function DynamicAccessKeyForm({ dynamicAccessKey }: Props) {
    const router = useRouter();
    const form = useForm<NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest>();
    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();

    const [selectedExpirationDate, setSelectedExpirationDate] = useState<string>();
    const [selectedLoadBalancer, setSelectedLoadBalancer] = useState<string | null>(null);
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest) => {
        setErrorMessage(() => "");

        try {
            data.loadBalancerAlgorithm ??= LoadBalancerAlgorithm.RandomKeyOnEachConnection;

            if (!data.path) {
                data.path = uuidv4();
            } else {
                data.path = slugify(data.path);
            }

            if (dynamicAccessKey) {
                const updateData = data as EditDynamicAccessKeyRequest;

                updateData.id = dynamicAccessKey.id;
                await updateDynamicAccessKey(updateData);
            } else {
                await createDynamicAccessKey(data);
            }

            router.push("/dynamic-access-keys");
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
        if (selectedLoadBalancer) {
            form.setValue("loadBalancerAlgorithm", selectedLoadBalancer, { shouldDirty: true });
        } else {
            form.setValue("loadBalancerAlgorithm", LoadBalancerAlgorithm.RandomKeyOnEachConnection, {
                shouldDirty: true
            });
        }
    }, [selectedLoadBalancer]);

    useEffect(() => {
        form.setValue("prefix", selectedPrefix, { shouldDirty: true });
    }, [selectedPrefix]);

    useEffect(() => {
        if (dynamicAccessKey) {
            form.reset({
                name: dynamicAccessKey.name,
                path: dynamicAccessKey.path,
                loadBalancerAlgorithm: dynamicAccessKey.loadBalancerAlgorithm,
                expiresAt: dynamicAccessKey.expiresAt,
                prefix: dynamicAccessKey.prefix
            });

            if (dynamicAccessKey.expiresAt) {
                setSelectedExpirationDate(moment(dynamicAccessKey.expiresAt).format("YYYY-MM-DD"));
            } else {
                setSelectedExpirationDate(undefined);
            }

            setSelectedLoadBalancer(dynamicAccessKey.loadBalancerAlgorithm);
            setSelectedPrefix(dynamicAccessKey.prefix);
        } else {
            form.reset({
                name: "",
                path: "",
                loadBalancerAlgorithm: LoadBalancerAlgorithm.RandomKeyOnEachConnection,
                expiresAt: null,
                prefix: null
            });

            setSelectedExpirationDate(undefined);
            setSelectedLoadBalancer(null);
            setSelectedPrefix(null);
        }
    }, []);

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
                    <Tooltip closeDelay={100} color="default" content="Dynamic access keys" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/dynamic-access-keys" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">
                        {dynamicAccessKey ? `Dynamic Access Key "${dynamicAccessKey.name}"` : "New Dynamic Access Key"}
                    </h1>
                </section>

                <form className="grid gap-4 w-full max-w-[464px]" onSubmit={form.handleSubmit(actualSubmit)}>
                    <Input
                        errorMessage={form.formState.errors.name?.message}
                        isInvalid={!!form.formState.errors.name}
                        label="Dynamic access key name"
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

                    <Input
                        description="The path will be automatically generated if you leave this field empty"
                        errorMessage={form.formState.errors.path?.message}
                        isInvalid={!!form.formState.errors.path}
                        label="Custom path (optional)"
                        placeholder="e.g. /dummy-dum-dummo"
                        size="sm"
                        variant="underlined"
                        {...form.register("path", {
                            required: false,
                            maxLength: {
                                value: 120,
                                message: "The name cannot be more than 120 character"
                            }
                        })}
                    />

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
                                {selectedLoadBalancer
                                    ? `Selected algo: ${selectedLoadBalancer}`
                                    : "Load balancer algorithm"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            defaultSelectedKeys={selectedLoadBalancer ? new Set([selectedLoadBalancer]) : undefined}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(v) => setSelectedLoadBalancer(v.currentKey!)}
                        >
                            <DropdownItem key={LoadBalancerAlgorithm.RandomKeyOnEachConnection}>
                                {LoadBalancerAlgorithm.RandomKeyOnEachConnection}
                            </DropdownItem>
                            <DropdownItem key={LoadBalancerAlgorithm.RandomServerKeyOnEachConnection}>
                                {LoadBalancerAlgorithm.RandomServerKeyOnEachConnection}
                            </DropdownItem>
                            <DropdownItem key={LoadBalancerAlgorithm.UserIpAddress}>
                                {LoadBalancerAlgorithm.UserIpAddress}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

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
