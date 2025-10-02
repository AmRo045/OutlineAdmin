import { UseDisclosureReturn } from "@heroui/use-disclosure";
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
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { AccessKey } from "@prisma/client";
import moment from "moment";

import { DeleteIcon } from "@/src/components/icons";
import { AccessKeyPrefixType, DataLimitUnit, EditAccessKeyRequest, NewAccessKeyRequest } from "@/src/core/definitions";
import { createAccessKey, updateAccessKey } from "@/src/core/actions/access-key";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import CustomDatePicker from "@/src/components/custom-date-picker";
import { syncServer } from "@/src/core/actions/server";
import { MAX_DATA_LIMIT_FOR_ACCESS_KEYS } from "@/src/core/config";

interface Props {
    disclosure: UseDisclosureReturn;
    serverId: number;
    accessKeyData?: AccessKey;
    onSuccess?: () => void;
}

export default function AccessKeyFormModal({ disclosure, serverId, accessKeyData, onSuccess }: Props) {
    const form = useForm<NewAccessKeyRequest | EditAccessKeyRequest>();

    const [serverError, setServerError] = useState<string>();

    const [selectedExpirationDate, setSelectedExpirationDate] = useState<string>();
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewAccessKeyRequest | EditAccessKeyRequest) => {
        setServerError(() => "");

        try {
            data.serverId ??= serverId;
            data.dataLimitUnit = DataLimitUnit.MB;

            if (accessKeyData) {
                const updateData = data as EditAccessKeyRequest;

                updateData.id = accessKeyData.id;
                await updateAccessKey(updateData);
            } else {
                await createAccessKey(data);
            }

            disclosure.onClose();

            await syncServer(serverId);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setServerError(() => (error as object).toString());
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
        if (disclosure.isOpen) {
            setServerError("");

            if (accessKeyData) {
                form.reset({
                    serverId: accessKeyData.serverId,
                    name: accessKeyData.name,
                    dataLimit: accessKeyData.dataLimit,
                    expiresAt: accessKeyData.expiresAt,
                    prefix: accessKeyData.prefix
                });

                if (accessKeyData.expiresAt) {
                    setSelectedExpirationDate(moment(accessKeyData.expiresAt).format("YYYY-MM-DD"));
                } else {
                    setSelectedExpirationDate(undefined);
                }

                setSelectedPrefix(accessKeyData.prefix);
            } else {
                form.reset({
                    serverId: serverId,
                    name: "",
                    dataLimit: null,
                    expiresAt: null,
                    prefix: null
                });

                setSelectedExpirationDate(undefined);
                setSelectedPrefix(null);
            }
        }
    }, [disclosure.isOpen]);

    return (
        <Modal isDismissable={false} isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
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
                                endContent={<span>MB</span>}
                                isInvalid={!!form.formState.errors.dataLimit}
                                label="Data limit"
                                size="sm"
                                type="number"
                                variant="faded"
                                {...form.register("dataLimit", {
                                    required: false,
                                    min: 0,
                                    max: MAX_DATA_LIMIT_FOR_ACCESS_KEYS,
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
