import { v4 as uuidv4 } from "uuid";
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
import { DynamicAccessKey } from "@prisma/client";

import {
    AccessKeyPrefixType,
    EditDynamicAccessKeyRequest,
    LoadBalancerAlgorithm,
    NewDynamicAccessKeyRequest
} from "@/core/definitions";
import { AccessKeyPrefixes } from "@/core/outline/access-key-prefix";
import { createDynamicAccessKey, updateDynamicAccessKey } from "@/core/actions/dynamic-access-key";

interface Props {
    disclosure: UseDisclosureReturn;
    dynamicAccessKeyData?: DynamicAccessKey;
}

export default function DynamicAccessKeyFormModal({ disclosure, dynamicAccessKeyData }: Props) {
    const form = useForm<NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest>();

    const [serverError, setServerError] = useState<string>();

    const [selectedLoadBalancer, setSelectedLoadBalancer] = useState<string | null>(null);
    const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null);

    const actualSubmit = async (data: NewDynamicAccessKeyRequest | EditDynamicAccessKeyRequest) => {
        setServerError(() => "");

        try {
            data.loadBalancerAlgorithm ??= LoadBalancerAlgorithm.RandomKeyOnEachConnection;

            if (!data.path) {
                data.path = uuidv4();
            } else {
                data.path = data.path.replace(/^\//, "");
            }

            if (dynamicAccessKeyData) {
                const updateData = data as EditDynamicAccessKeyRequest;

                updateData.id = dynamicAccessKeyData.id;
                await updateDynamicAccessKey(updateData);
            } else {
                await createDynamicAccessKey(data);
            }

            disclosure.onClose();
        } catch (error) {
            setServerError(() => (error as object).toString());
        }
    };

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
        if (disclosure.isOpen) {
            setServerError("");

            if (dynamicAccessKeyData) {
                form.reset({
                    name: dynamicAccessKeyData.name,
                    path: dynamicAccessKeyData.path,
                    loadBalancerAlgorithm: dynamicAccessKeyData.loadBalancerAlgorithm,
                    expiresAt: dynamicAccessKeyData.expiresAt,
                    prefix: dynamicAccessKeyData.prefix
                });

                setSelectedLoadBalancer(dynamicAccessKeyData.loadBalancerAlgorithm);
                setSelectedPrefix(dynamicAccessKeyData.prefix);
            } else {
                form.reset({
                    name: "",
                    path: "",
                    loadBalancerAlgorithm: LoadBalancerAlgorithm.RandomKeyOnEachConnection,
                    expiresAt: null,
                    prefix: null
                });

                setSelectedLoadBalancer(null);
                setSelectedPrefix(null);
            }
        }
    }, [disclosure.isOpen]);

    return (
        <Modal isDismissable={false} isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
            <ModalContent>
                <ModalHeader>
                    {dynamicAccessKeyData
                        ? `Dynamic Access Key "${dynamicAccessKeyData.name}"`
                        : "New Dynamic Access Key"}
                </ModalHeader>
                <ModalBody>
                    {serverError && (
                        <div className="text-sm grid gap-2">
                            <span>
                                Could not {dynamicAccessKeyData ? "edit" : "create"} dynamic access key. Something went
                                wrong.
                            </span>
                            <pre className="break-words whitespace-pre-wrap text-danger-500">{serverError}</pre>
                        </div>
                    )}

                    <form className="grid gap-4" id="dynamicAccessKeyForm" onSubmit={form.handleSubmit(actualSubmit)}>
                        <Input
                            isInvalid={!!form.formState.errors.name}
                            isRequired={true}
                            label="Dynamic access key name"
                            size="sm"
                            variant="faded"
                            {...form.register("name", {
                                required: true,
                                maxLength: 64
                            })}
                        />

                        <Input
                            description="The path will be automatically generated if you leave this field empty"
                            isInvalid={!!form.formState.errors.path}
                            label="Custom path (optional)"
                            placeholder="e.g. /dummy-dum-dummo"
                            size="sm"
                            variant="faded"
                            {...form.register("path", {
                                required: false,
                                maxLength: 120
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
                    </form>
                </ModalBody>
                <ModalFooter className="flex justify-between gap-2 mt-4">
                    <Button variant="flat" onPress={disclosure.onClose}>
                        Cancel
                    </Button>

                    <Button
                        color="primary"
                        form="dynamicAccessKeyForm"
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
