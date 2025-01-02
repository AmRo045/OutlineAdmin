"use client";

import {
    Button,
    Chip,
    Link,
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
import { AccessKey, Server } from "@prisma/client";

import AccessKeyModal from "@/components/modals/access-key-modal";
import AccessKeyFormModal from "@/components/modals/access-key-form-modal";
import ConfirmModal from "@/components/modals/confirm-modal";
import { ArrowLeftIcon, DeleteIcon, EditIcon, EyeIcon, InfinityIcon, PlusIcon } from "@/components/icons";
import AccessKeyServerInfo from "@/components/access-key-server-info";
import { convertDataLimitToUnit, formatBytes } from "@/core/utils";
import { removeAccessKey } from "@/core/actions/access-key";
import { DataLimitUnit } from "@/core/definitions";
import NoResult from "@/components/no-result";
import AccessKeyValidityChip from "@/components/access-key-validity-chip";
import MessageModal from "@/components/modals/message-modal";
import { AccessKeyPrefixes } from "@/core/outline/access-key-prefix";

interface Props {
    server: Server;
    accessKeys: AccessKey[];
}

export default function ServerAccessKeys({ server, accessKeys }: Props) {
    const accessKeyFormModalDisclosure = useDisclosure();
    const accessKeyModalDisclosure = useDisclosure();
    const removeAccessKeyConfirmModalDisclosure = useDisclosure();
    const apiErrorModalDisclosure = useDisclosure();

    const [serverError, setServerError] = useState<string>();
    const [formattedAccessKey, setFormattedAccessKey] = useState<string>();
    const [currentAccessKey, setCurrentAccessKey] = useState<AccessKey>();

    const handleRemoveAccessKey = async () => {
        if (!currentAccessKey) return;
        try {
            await removeAccessKey(server.id, currentAccessKey.id, currentAccessKey.apiId);
        } catch (error) {
            setServerError((error as object).toString());
            apiErrorModalDisclosure.onOpen();
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

    return (
        <>
            <AccessKeyModal disclosure={accessKeyModalDisclosure} value={formattedAccessKey} />

            <AccessKeyFormModal
                accessKeyData={currentAccessKey}
                disclosure={accessKeyFormModalDisclosure}
                serverId={server.id}
            />

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

                    <Button as={Link} color="primary" href={`/servers/${server.id}/settings`} variant="light">
                        Settings
                    </Button>
                </section>

                <AccessKeyServerInfo numberOfKeys={accessKeys.length} server={server} />

                <section className="grid gap-6">
                    <div className="flex justify-between items-center gap-2">
                        <h1 className="text-xl">🗝️ Access Keys</h1>

                        <Button
                            color="primary"
                            startContent={<PlusIcon size={20} />}
                            variant="shadow"
                            onPress={() => {
                                setCurrentAccessKey(undefined);
                                accessKeyFormModalDisclosure.onOpen();
                            }}
                        >
                            New
                        </Button>
                    </div>

                    <Table
                        aria-label="Servers list"
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
                        <TableBody emptyContent={<NoResult />}>
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
                                                        setCurrentAccessKey(accessKey);
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
                                                    isIconOnly={true}
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => {
                                                        setCurrentAccessKey(accessKey);
                                                        accessKeyFormModalDisclosure.onOpen();
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
                                                        setCurrentAccessKey(accessKey);
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
