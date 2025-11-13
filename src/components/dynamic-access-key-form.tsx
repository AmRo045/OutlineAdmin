"use client";

import { DynamicAccessKey, Server, Tag } from "@prisma/client";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import moment from "moment";
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Chip,
    cn,
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
import { Radio, RadioGroup } from "@heroui/radio";

import {
    AccessKeyPrefixType,
    EditDynamicAccessKeyRequest,
    LoadBalancerAlgorithm,
    NewDynamicAccessKeyRequest
} from "@/src/core/definitions";
import {
    createDynamicAccessKey,
    removeSelfManagedDynamicAccessKeyAccessKeys,
    syncDynamicAccessKeyAccessKeys,
    updateDynamicAccessKey
} from "@/src/core/actions/dynamic-access-key";
import MessageModal from "@/src/components/modals/message-modal";
import { ArrowLeftIcon, DeleteIcon } from "@/src/components/icons";
import CustomDatePicker from "@/src/components/custom-date-picker";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import { MAX_DATA_LIMIT_FOR_ACCESS_KEYS } from "@/src/core/config";

interface Props {
    servers: Server[];
    tags: Tag[];
    dynamicAccessKey?: DynamicAccessKey | null;
}

export default function DynamicAccessKeyForm({ dynamicAccessKey, tags, servers }: Props) {
    const router = useRouter();
    const form = useForm<NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest>({
        defaultValues: dynamicAccessKey
            ? {
                  name: dynamicAccessKey.name,
                  path: dynamicAccessKey.path,
                  loadBalancerAlgorithm: dynamicAccessKey.loadBalancerAlgorithm,
                  expiresAt: dynamicAccessKey.expiresAt,
                  prefix: dynamicAccessKey.prefix,
                  isSelfManaged: dynamicAccessKey.isSelfManaged,
                  serverPoolType: dynamicAccessKey.serverPoolType,
                  serverPoolValue: dynamicAccessKey.serverPoolValue
                      ? JSON.parse(dynamicAccessKey.serverPoolValue)
                      : null,
                  validityPeriod: dynamicAccessKey.validityPeriod ? dynamicAccessKey.validityPeriod : null,
                  dataLimit: Number(dynamicAccessKey.dataLimit)
              }
            : {
                  name: "",
                  path: "",
                  loadBalancerAlgorithm: LoadBalancerAlgorithm.RandomKeyOnEachConnection,
                  expiresAt: null,
                  prefix: null,
                  isSelfManaged: false,
                  serverPoolType: null,
                  serverPoolValue: null,
                  validityPeriod: null,
                  dataLimit: null
              }
    });

    const errorModalDisclosure = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>();

    const [selectedExpirationDate, setSelectedExpirationDate] = useState<string>();
    const [selectedLoadBalancer, setSelectedLoadBalancer] = useState<string | null>(null);
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest) => {
        setErrorMessage(() => "");

        try {
            if (data.isSelfManaged) {
                if (Array.isArray(data.serverPoolValue)) {
                    data.serverPoolValue = JSON.stringify(data.serverPoolValue);
                }
            } else {
                data.serverPoolType = null;
                data.serverPoolValue = null;
            }

            data.loadBalancerAlgorithm ??= LoadBalancerAlgorithm.RandomKeyOnEachConnection;

            if (!data.path) {
                data.path = uuidv4();
            } else {
                data.path = slugify(data.path);
            }

            if (dynamicAccessKey) {
                const updateData = data as EditDynamicAccessKeyRequest;

                if (dynamicAccessKey.isSelfManaged) {
                    await removeSelfManagedDynamicAccessKeyAccessKeys(dynamicAccessKey.id);
                }

                updateData.id = dynamicAccessKey.id;
                await updateDynamicAccessKey(updateData);

                if (!dynamicAccessKey.isSelfManaged && updateData.isSelfManaged) {
                    await syncDynamicAccessKeyAccessKeys(dynamicAccessKey.id, []);
                }
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
            if (dynamicAccessKey.expiresAt) {
                setSelectedExpirationDate(moment(dynamicAccessKey.expiresAt).format("YYYY-MM-DD"));
            } else {
                setSelectedExpirationDate(undefined);
            }

            setSelectedLoadBalancer(dynamicAccessKey.loadBalancerAlgorithm);
            setSelectedPrefix(dynamicAccessKey.prefix);
        } else {
            setSelectedExpirationDate(undefined);
            setSelectedLoadBalancer(null);
            setSelectedPrefix(null);
        }
    }, [dynamicAccessKey]);

    const isSelfManaged = form.watch("isSelfManaged");
    const serverPoolType = form.watch("serverPoolType");
    const serverPoolValue = Array.from(form.watch("serverPoolValue") ?? []).map(String);

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

                    {!selectedExpirationDate && (
                        <>
                            <Input
                                color="primary"
                                errorMessage={form.formState.errors.validityPeriod?.message}
                                isInvalid={!!form.formState.errors.validityPeriod}
                                label="Validity period (in days)"
                                placeholder="e.g. 30"
                                type="number"
                                variant="underlined"
                                {...form.register("validityPeriod", {
                                    max: {
                                        value: 10000,
                                        message: "The value must be less than 1000"
                                    },
                                    min: {
                                        value: 1,
                                        message: "The value must be greater than 1"
                                    }
                                })}
                            />

                            {!dynamicAccessKey && (
                                <RadioGroup
                                    defaultValue="now"
                                    label="Usage start date"
                                    onValueChange={(v) => {
                                        form.setValue("setUsageDateOnFirstConnection", v === "first-connection");
                                    }}
                                >
                                    <Radio value="now">Set on creation</Radio>
                                    <Radio value="first-connection">Set on first connection</Radio>
                                </RadioGroup>
                            )}
                        </>
                    )}

                    {selectedExpirationDate && (
                        <div className="flex gap-2">
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

                            <CustomDatePicker
                                label="Expiration Date:"
                                value={selectedExpirationDate}
                                onChange={(value) => setSelectedExpirationDate(value)}
                            />
                        </div>
                    )}

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

                    <RadioGroup
                        defaultValue={isSelfManaged ? "self-managed" : "manual"}
                        label="Management Type"
                        onValueChange={(v) => form.setValue("isSelfManaged", v === "self-managed")}
                    >
                        <Radio value="manual">Manual</Radio>
                        <Radio value="self-managed">Self-Managed</Radio>
                    </RadioGroup>

                    <ul className="p-4 grid gap-2 rounded-xl bg-content2 text-foreground-500">
                        <li>
                            <strong className="text-warning">Manual:</strong> You’ll need to assign and remove access
                            keys yourself. This option gives you full control, but requires more effort.
                        </li>
                        <li>
                            <strong className="text-warning">Self-Managed:</strong> You’ll set up a server pool, and the
                            system will automatically handle access key management for you. This option is easier to
                            maintain once configured.
                        </li>
                    </ul>

                    {isSelfManaged && (
                        <div className="grid gap-4">
                            <Divider />

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
                                    min: 1,
                                    max: {
                                        value: MAX_DATA_LIMIT_FOR_ACCESS_KEYS,
                                        message: `The value cannot be more that ${MAX_DATA_LIMIT_FOR_ACCESS_KEYS}`
                                    },
                                    setValueAs: (v) => parseInt(v)
                                })}
                            />

                            <RadioGroup
                                defaultValue={serverPoolType}
                                label="Server Pool Type"
                                onValueChange={(v) => {
                                    form.setValue("serverPoolType", v);
                                    form.setValue("serverPoolValue", null);
                                }}
                            >
                                <Radio value="manual">Manual</Radio>
                                <Radio value="tag">Tag (Recommended)</Radio>
                            </RadioGroup>

                            <ul className="p-4 grid gap-2 rounded-xl bg-content2 text-foreground-500">
                                <li>
                                    <strong className="text-warning">Manual:</strong> You’ll manually select which
                                    servers belong to this pool. This gives you full control over the pool’s
                                    composition.
                                </li>
                                <li>
                                    <strong className="text-warning">Tag (Recommended):</strong> The system will
                                    automatically include servers that match the specified tags.
                                </li>
                            </ul>

                            {serverPoolType === "manual" && (
                                <div className="grid gap-4">
                                    <Divider />

                                    <CheckboxGroup
                                        defaultValue={serverPoolValue}
                                        label="Select Servers"
                                        onValueChange={(values) => {
                                            const ids = values.map((x) => parseInt(x));

                                            form.setValue("serverPoolValue", JSON.stringify(ids));
                                        }}
                                    >
                                        {servers.map((server) => (
                                            <Checkbox
                                                key={server.id}
                                                aria-label={server.name}
                                                classNames={{
                                                    base: cn(
                                                        "ms-0.5 inline-flex w-full max-w-md bg-content1 mb-1",
                                                        "hover:bg-content2 items-center justify-start",
                                                        "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                                                        "data-[selected=true]:border-primary"
                                                    ),
                                                    label: "w-full"
                                                }}
                                                value={String(server.id)}
                                            >
                                                <div className="grid gap-2">
                                                    <span className="text-sm">{server.name}</span>
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
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                </div>
                            )}

                            {serverPoolType === "tag" && (
                                <div className="grid gap-4">
                                    <Divider />

                                    <CheckboxGroup
                                        defaultValue={serverPoolValue}
                                        label="Select Tags"
                                        onValueChange={(values) => {
                                            const ids = values.map((x) => parseInt(x));

                                            form.setValue("serverPoolValue", JSON.stringify(ids));
                                        }}
                                    >
                                        {tags.map((tag) => (
                                            <Checkbox key={tag.id} value={String(tag.id)}>
                                                {tag.name}
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
                                </div>
                            )}
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
