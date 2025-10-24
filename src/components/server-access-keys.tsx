"use client";

import {
    Button,
    Chip,
    Link,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { AccessKey, Server } from "@prisma/client";

import AccessKeyModal from "@/src/components/modals/access-key-modal";
import ConfirmModal from "@/src/components/modals/confirm-modal";
import { ArrowLeftIcon, DeleteIcon, EditIcon, EyeIcon, InfinityIcon, PlusIcon } from "@/src/components/icons";
import AccessKeyServerInfo from "@/src/components/access-key-server-info";
import { convertDataLimitToUnit, formatBytes } from "@/src/core/utils";
import { getAccessKeys, removeAccessKey } from "@/src/core/actions/access-key";
import { DataLimitUnit } from "@/src/core/definitions";
import NoResult from "@/src/components/no-result";
import AccessKeyValidityChip from "@/src/components/access-key-validity-chip";
import MessageModal from "@/src/components/modals/message-modal";
import { AccessKeyPrefixes } from "@/src/core/outline/access-key-prefix";
import { syncServer } from "@/src/core/actions/server";
import { PAGE_SIZE } from "@/src/core/config";

interface Props {
    server: Server;
    total: number;
}

export default function ServerAccessKeys({ server, total }: Props) {
    const accessKeyModalDisclosure = useDisclosure();
    const removeAccessKeyConfirmModalDisclosure = useDisclosure();
    const apiErrorModalDisclosure = useDisclosure();

    const totalPage = Math.ceil(total / PAGE_SIZE);

    const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
    const [serverError, setServerError] = useState<string>();
    const [formattedAccessKey, setFormattedAccessKey] = useState<string>();
    const [currentAccessKey, setCurrentAccessKey] = useState<AccessKey>();
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleRemoveAccessKey = async () => {
        if (!currentAccessKey) return;
        try {
            await removeAccessKey(server.id, currentAccessKey.id, currentAccessKey.apiId);
            await updateData();
        } catch (error) {
            setServerError((error as object).toString());
            apiErrorModalDisclosure.onOpen();
        } finally {
            await syncServer(server);
        }
    };

    const updateData = async () => {
        setIsLoading(true);

        try {
            const data = await getAccessKeys(server.id, { skip: (page - 1) * PAGE_SIZE });

            setAccessKeys(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!currentAccessKey) return;

        let prefixUrlValue = "";

        if (currentAccessKey.prefix) {
            const prefix = AccessKeyPrefixes.find((x) => x.type === currentAccessKey.prefix);

            if (prefix) {
                prefixUrlValue = `?prefix=${prefix.urlEncodedValue}`;
            }
        }

        setFormattedAccessKey(
            `${currentAccessKey.accessUrl}${prefixUrlValue}#${encodeURIComponent(currentAccessKey.name)}`
        );
    }, [currentAccessKey]);

    useEffect(() => {
        updateData();
    }, [page]);

    return (
        <>
            <AccessKeyModal disclosure={accessKeyModalDisclosure} value={formattedAccessKey} />

            <MessageModal
                body={
                    <div className="grid gap-2">
                        <span>Could not delete the access key. Something went wrong.</span>
                        <pre className="text-sm break-words whitespace-pre-wrap text-danger-500">{serverError}</pre>
                    </div>
                }
                disclosure={apiErrorModalDisclosure}
                title="Server Error!"
            />

            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>Are you sure you want to remove this access key?</span>
                        <p className="text-default-500 text-sm whitespace-pre-wrap break-all">
                            {currentAccessKey?.accessUrl}
                        </p>
                    </div>
                }
                confirmLabel="Remove"
                disclosure={removeAccessKeyConfirmModalDisclosure}
                title="Remove Access Key"
                onConfirm={handleRemoveAccessKey}
            />

            <div className="grid gap-6">
                <section className="flex justify-between items-center gap-2">
                    <section className="flex items-center gap-2">
                        <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                            <Button as={Link} href="/servers" isIconOnly={true} size="sm" variant="light">
                                <ArrowLeftIcon size={20} />
                            </Button>
                        </Tooltip>

                        <h1 className="text-xl">{server.name}</h1>
                    </section>

                    <Button
                        as={Link}
                        color="primary"
                        href={`/servers/${server.id}/settings?return=/servers/${server.id}/access-keys`}
                        variant="light"
                    >
                        Settings
                    </Button>
                </section>

                <AccessKeyServerInfo numberOfKeys={accessKeys.length} server={server} />

                <section className="grid gap-6">
                    <div className="flex justify-between items-center gap-2">
                        <h1 className="text-xl">🗝️ Access Keys</h1>

                        <Button
                            as={Link}
                            color="primary"
                            href={`/servers/${server.id}/access-keys/create`}
                            startContent={<PlusIcon size={20} />}
                            variant="shadow"
                        >
                            Create
                        </Button>
                    </div>

                    <Table
                        aria-label="Servers list"
                        bottomContent={
                            totalPage > 1 && (
                                <div className="flex justify-center">
                                    <Pagination
                                        initialPage={page}
                                        total={totalPage}
                                        variant="light"
                                        onChange={setPage}
                                    />
                                </div>
                            )
                        }
                        color="primary"
                        isCompact={false}
                        isHeaderSticky={true}
                        isStriped={true}
                        shadow="sm"
                    >
                        <TableHeader>
                            <TableColumn>ID</TableColumn>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn align="center">DATA USAGE</TableColumn>
                            <TableColumn align="center">VALIDITY</TableColumn>
                            <TableColumn align="center">PREFIX</TableColumn>
                            <TableColumn align="center">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={<NoResult />} isLoading={isLoading} loadingContent={<Spinner />}>
                            {accessKeys.map((accessKey) => (
                                <TableRow key={accessKey.id}>
                                    <TableCell>{accessKey.id}</TableCell>
                                    <TableCell>{accessKey.name}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2 items-center">
                                            <span>{formatBytes(Number(accessKey.dataUsage))}</span>
                                            <span className="text-default-500">of</span>
                                            {accessKey.dataLimit ? (
                                                <span>
                                                    {formatBytes(
                                                        convertDataLimitToUnit(
                                                            Number(accessKey.dataLimit),
                                                            accessKey.dataLimitUnit as DataLimitUnit
                                                        )
                                                    )}
                                                </span>
                                            ) : (
                                                <InfinityIcon size={20} />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell width={160}>
                                        <AccessKeyValidityChip value={accessKey.expiresAt} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip color={accessKey.prefix ? "success" : "default"} size="sm" variant="flat">
                                            {accessKey.prefix ? accessKey.prefix : "None"}
                                        </Chip>
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
                                                        setCurrentAccessKey(() => accessKey);
                                                        accessKeyModalDisclosure.onOpen();
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
                                                    as={Link}
                                                    color="primary"
                                                    href={`/servers/${server.id}/access-keys/${accessKey.id}/edit`}
                                                    isIconOnly={true}
                                                    size="sm"
                                                    variant="light"
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
                                                        setCurrentAccessKey(() => accessKey);
                                                        removeAccessKeyConfirmModalDisclosure.onOpen();
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
                </section>
            </div>
        </>
    );
}
