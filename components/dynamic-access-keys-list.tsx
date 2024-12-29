"use client";

import {
    Button,
    Chip,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicAccessKey } from "@prisma/client";
import { Link } from "@nextui-org/link";

import ConfirmModal from "@/components/modals/confirm-modal";
import { DeleteIcon, EditIcon, EyeIcon, InfoIcon, PlusIcon } from "@/components/icons";
import NoResult from "@/components/no-result";
import { DynamicAccessKeyWithAccessKeysCount } from "@/core/definitions";
import { getDynamicAccessKeys, removeDynamicAccessKey } from "@/core/actions/dynamic-access-key";
import AccessKeyValidityChip from "@/components/access-key-validity-chip";
import DynamicAccessKeyModal from "@/components/modals/dynamic-access-key-modal";
import DynamicAccessKeyFormModal from "@/components/modals/dynamic-access-key-form-modal";
import { app } from "@/core/config";

interface Props {
    data: DynamicAccessKeyWithAccessKeysCount[];
}

interface SearchFormProps {
    term: string;
}

export default function DynamicAccessKeysList({ data }: Props) {
    const [dynamicAccessKeys, setDynamicAccessKeys] = useState<DynamicAccessKeyWithAccessKeysCount[]>(data);
    const [currentDynamicAccessKey, setCurrentDynamicAccessKey] = useState<DynamicAccessKey>();

    const dynamicAccessKeyFormModalDisclosure = useDisclosure();
    const removeDynamicAccessKeyConfirmModalDisclosure = useDisclosure();
    const dynamicAccessKeyModalDisclosure = useDisclosure();

    const searchForm = useForm<SearchFormProps>();
    const handleSearch = async (data: SearchFormProps) => {
        const filteredServers = await getDynamicAccessKeys(
            {
                term: data.term
            },
            true
        );

        setDynamicAccessKeys(filteredServers);
    };

    const handleRemoveDynamicAccessKey = async () => {
        if (!currentDynamicAccessKey) return;

        await removeDynamicAccessKey(currentDynamicAccessKey.id);
    };

    const getCurrentAccessKeyUrl = () => {
        if (!currentDynamicAccessKey) return;

        const swappedProtocol = window.location.origin.replace("http://", "ssconf://").replace("https://", "ssconf://");

        return `${swappedProtocol}/api/dak/${currentDynamicAccessKey.path}`;
    };

    useEffect(() => {
        setDynamicAccessKeys(data);
    }, [data]);

    return (
        <>
            <DynamicAccessKeyModal disclosure={dynamicAccessKeyModalDisclosure} value={getCurrentAccessKeyUrl()} />

            <DynamicAccessKeyFormModal
                disclosure={dynamicAccessKeyFormModalDisclosure}
                dynamicAccessKeyData={currentDynamicAccessKey}
            />

            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>Are you sure you want to remove this dynamic access key?</span>
                        <p className="text-default-500 text-sm whitespace-pre-wrap break-all">
                            {getCurrentAccessKeyUrl()}
                        </p>
                    </div>
                }
                confirmLabel="Remove"
                disclosure={removeDynamicAccessKeyConfirmModalDisclosure}
                title="Remove Dyanmic Access Key"
                onConfirm={handleRemoveDynamicAccessKey}
            />

            <div className="grid gap-4">
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl">Your Dynamic Access Keys</h1>

                    <Tooltip content="Read more about dynamic access keys">
                        <Link href={app.links.outlineWiki.dynamicAccessKeys} target="_blank">
                            <InfoIcon size={20} />
                        </Link>
                    </Tooltip>
                </div>

                <div className="flex justify-between items-center gap-2">
                    <form onSubmit={searchForm.handleSubmit(handleSearch)}>
                        <Input
                            className="w-fit"
                            placeholder="Name [+Enter]"
                            startContent={<>🔍</>}
                            variant="faded"
                            {...searchForm.register("term")}
                        />
                    </form>

                    <Button
                        color="primary"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                        onPress={() => {
                            setCurrentDynamicAccessKey(undefined);
                            dynamicAccessKeyFormModalDisclosure.onOpen();
                        }}
                    >
                        Create
                    </Button>
                </div>

                <Table
                    aria-label="Dynamic access keys list"
                    color="primary"
                    isCompact={false}
                    isHeaderSticky={true}
                    isStriped={true}
                    shadow="sm"
                >
                    <TableHeader>
                        <TableColumn>ID</TableColumn>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>PATH</TableColumn>
                        <TableColumn>PREFIX</TableColumn>
                        <TableColumn align="center">NUMBER OF KEYS</TableColumn>
                        <TableColumn align="center">LOAD BALANCER ALGO</TableColumn>
                        <TableColumn align="center">VALIDITY</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={<NoResult />}>
                        {dynamicAccessKeys.map((dynamicAccessKey) => (
                            <TableRow key={dynamicAccessKey.id}>
                                <TableCell>{dynamicAccessKey.id}</TableCell>
                                <TableCell>{dynamicAccessKey.name}</TableCell>
                                <TableCell>{dynamicAccessKey.path}</TableCell>
                                <TableCell>
                                    <Chip
                                        color={dynamicAccessKey.prefix ? "success" : "default"}
                                        size="sm"
                                        variant="flat"
                                    >
                                        {dynamicAccessKey.prefix ? dynamicAccessKey.prefix : "None"}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Chip color="default" size="sm" variant="flat">
                                        {dynamicAccessKey._count?.accessKeys}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Chip color="default" size="sm" variant="flat">
                                        {dynamicAccessKey.loadBalancerAlgorithm}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <AccessKeyValidityChip value={dynamicAccessKey.expiresAt} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-center items-center">
                                        <Tooltip
                                            closeDelay={100}
                                            color="primary"
                                            content="Show the key"
                                            delay={600}
                                            size="sm"
                                        >
                                            <Button
                                                color="primary"
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                                onPress={() => {
                                                    setCurrentDynamicAccessKey(dynamicAccessKey);
                                                    dynamicAccessKeyModalDisclosure.onOpen();
                                                }}
                                            >
                                                <EyeIcon size={24} />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip
                                            closeDelay={100}
                                            color="primary"
                                            content="Edit the key"
                                            delay={600}
                                            size="sm"
                                        >
                                            <Button
                                                color="primary"
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                                onPress={() => {
                                                    setCurrentDynamicAccessKey(dynamicAccessKey);
                                                    dynamicAccessKeyFormModalDisclosure.onOpen();
                                                }}
                                            >
                                                <EditIcon size={24} />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip
                                            closeDelay={100}
                                            color="danger"
                                            content="Remove the key"
                                            delay={600}
                                            size="sm"
                                        >
                                            <Button
                                                color="danger"
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                                onPress={() => {
                                                    setCurrentDynamicAccessKey(dynamicAccessKey);
                                                    removeDynamicAccessKeyConfirmModalDisclosure.onOpen();
                                                }}
                                            >
                                                <DeleteIcon size={24} />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
