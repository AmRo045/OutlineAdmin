import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import React, { useEffect, useState } from "react";
import {
    Button,
    Chip,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { AccessKey } from "@prisma/client";

import { AccessKeyPrefixType, DataLimitUnit, EditAccessKeyRequest, NewAccessKeyRequest } from "@/core/definitions";
import { createAccessKey, updateAccessKey } from "@/core/actions/access-key";
import { AccessKeyPrefixes } from "@/core/outline/access-key-prefix";

interface Props {
    disclosure: UseDisclosureReturn;
    serverId: number;
    accessKeyData?: AccessKey;
}

export default function AccessKeyFormModal({ disclosure, serverId, accessKeyData }: Props) {
    const form = useForm<NewAccessKeyRequest | EditAccessKeyRequest>();

    const [serverError, setServerError] = useState<string>();

    const [selectedDataLimitUnit, setSelectedDataLimitUnit] = useState<string>(DataLimitUnit.Bytes);
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewAccessKeyRequest | EditAccessKeyRequest) => {
        setServerError(() => "");

        try {
            data.serverId ??= serverId;
            data.dataLimitUnit ??= DataLimitUnit.Bytes;

            if (accessKeyData) {
                const updateData = data as EditAccessKeyRequest;

                updateData.id = accessKeyData.id;
                await updateAccessKey(updateData);
            } else {
                await createAccessKey(data);
            }

            disclosure.onClose();
        } catch (error) {
            setServerError(() => (error as object).toString());
        }
    };

    useEffect(() => {
        form.setValue("dataLimitUnit", selectedDataLimitUnit as DataLimitUnit, { shouldDirty: true });
    }, [selectedDataLimitUnit]);

    useEffect(() => {
        form.setValue("prefix", selectedPrefix, { shouldDirty: true });
    }, [selectedPrefix]);

    useEffect(() => {
        if (disclosure.isOpen) {
            setServerError("");

            if (accessKeyData) {
                form.reset({
                    serverId: accessKeyData.serverId,
                    name: accessKeyData.name,
                    dataLimit: accessKeyData.dataLimit,
                    dataLimitUnit: accessKeyData.dataLimitUnit as DataLimitUnit,
                    expiresAt: accessKeyData.expiresAt,
                    prefix: accessKeyData.prefix
                });

                setSelectedDataLimitUnit(accessKeyData.dataLimitUnit);
                setSelectedPrefix(accessKeyData.prefix);
            } else {
                form.reset({
                    serverId: serverId,
                    name: "",
                    dataLimit: null,
                    dataLimitUnit: DataLimitUnit.Bytes,
                    expiresAt: null,
                    prefix: null
                });

                setSelectedDataLimitUnit(DataLimitUnit.Bytes);
                setSelectedPrefix(null);
            }
        }
    }, [disclosure.isOpen]);

    return (
        <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
            <ModalContent>
                <ModalHeader>{accessKeyData ? `Access Key "${accessKeyData.name}"` : "New Access Key"}</ModalHeader>
                <ModalBody>
                    {serverError && (
                        <div className="text-sm grid gap-2">
                            <span>Could not {accessKeyData ? "edit" : "create"} access key. Something went wrong.</span>
                            <pre className="break-words whitespace-pre-wrap text-danger-500">{serverError}</pre>
                        </div>
                    )}

                    <form className="grid gap-4" id="accessKeyForm" onSubmit={form.handleSubmit(actualSubmit)}>
                        <Input
                            isInvalid={!!form.formState.errors.name}
                            isRequired={true}
                            label="Access key name"
                            size="sm"
                            variant="faded"
                            {...form.register("name", {
                                required: true,
                                maxLength: 64
                            })}
                        />

                        <div className="flex gap-2">
                            <Input
                                isInvalid={!!form.formState.errors.dataLimit}
                                label="Data limit"
                                size="sm"
                                type="number"
                                variant="faded"
                                {...form.register("dataLimit", {
                                    required: false,
                                    min: 0,
                                    max: 1_000_000_000_000_000,
                                    setValueAs: (v) => parseInt(v)
                                })}
                            />

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="bg-default-100 text-sm"
                                        radius="sm"
                                        size="lg"
                                        type="button"
                                        variant="ghost"
                                    >
                                        {selectedDataLimitUnit}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    defaultSelectedKeys={new Set([selectedDataLimitUnit])}
                                    selectionMode="single"
                                    variant="flat"
                                    onSelectionChange={(v) => setSelectedDataLimitUnit(v.currentKey!)}
                                >
                                    <DropdownItem key={DataLimitUnit.Bytes}>{DataLimitUnit.Bytes}</DropdownItem>
                                    <DropdownItem key={DataLimitUnit.KB}>{DataLimitUnit.KB}</DropdownItem>
                                    <DropdownItem key={DataLimitUnit.MB}>{DataLimitUnit.MB}</DropdownItem>
                                    <DropdownItem key={DataLimitUnit.GB}>{DataLimitUnit.GB}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
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
                    </form>
                </ModalBody>
                <ModalFooter className="flex justify-between gap-2 mt-4">
                    <Button variant="flat" onPress={disclosure.onClose}>
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        form="accessKeyForm"
                        isLoading={!serverError && (form.formState.isSubmitting || form.formState.isSubmitSuccessful)}
                        type="submit"
                        variant="shadow"
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
