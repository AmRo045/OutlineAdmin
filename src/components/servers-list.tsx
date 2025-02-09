"use client";

import {
    Button,
    Chip,
    Input,
    Link,
    Snippet,
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
import { useForm } from "react-hook-form";

import ConfirmModal from "@/src/components/modals/confirm-modal";
import { CopyIcon, DeleteIcon, KeyIcon, PlusIcon, SettingsIcon } from "@/src/components/icons";
import { getServers, removeServer } from "@/src/core/actions/server";
import NoResult from "@/src/components/no-result";
import { ServerWithAccessKeysCount } from "@/src/core/definitions";
import { formatBytes } from "@/src/core/utils";
import { app } from "@/src/core/config";

interface Props {
    data: ServerWithAccessKeysCount[];
}

interface SearchFormProps {
    term: string;
}

export default function ServersList({ data }: Props) {
    const [servers, setServers] = useState<ServerWithAccessKeysCount[]>(data);
    const [serverToRemove, setServerToRemove] = useState<number | null>(null);
    const removeServerConfirmModalDisclosure = useDisclosure();

    const searchForm = useForm<SearchFormProps>();
    const handleSearch = async (data: SearchFormProps) => {
        const filteredServers = await getServers(
            {
                term: data.term
            },
            true
        );

        setServers(filteredServers);
    };

    const handleRemoveServer = async () => {
        if (!serverToRemove) return;

        await removeServer(serverToRemove);
    };

    useEffect(() => {
        setServers(data);
    }, [data]);

    return (
        <>
            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>Are you sure you want to remove this server?</span>
                        <p className="text-default-500 text-sm">
                            Please note that this action will only remove the server from the {app.name}
                            &apos;s database. The server itself will not be affected.
                        </p>
                    </div>
                }
                confirmLabel="Remove"
                disclosure={removeServerConfirmModalDisclosure}
                title="Remove Server"
                onConfirm={handleRemoveServer}
            />

            <div className="grid gap-4">
                <h1 className="text-xl">Your Servers</h1>

                <div className="flex justify-between items-center gap-2">
                    <form onSubmit={searchForm.handleSubmit(handleSearch)}>
                        <Input
                            className="w-fit"
                            placeholder="Name or Hostname [+Enter]"
                            startContent={<>🔍</>}
                            variant="faded"
                            {...searchForm.register("term")}
                        />
                    </form>

                    <Button
                        as={Link}
                        color="primary"
                        href="/servers/add"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                    >
                        Add
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
                        <TableColumn>HOSTNAME OR IP</TableColumn>
                        <TableColumn align="center">NUMBER OF KEYS</TableColumn>
                        <TableColumn align="center">TOTAL USAGE</TableColumn>
                        <TableColumn align="center">STATUS</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={<NoResult />}>
                        {servers.map((server) => (
                            <TableRow key={server.id}>
                                <TableCell>{server.id}</TableCell>
                                <TableCell>{server.name}</TableCell>
                                <TableCell>
                                    <Snippet
                                        classNames={{
                                            copyButton: "text-sm !min-w-6 !w-6 h-6",
                                            pre: "!ps-1"
                                        }}
                                        copyIcon={<CopyIcon size={16} />}
                                        hideSymbol={true}
                                        size="sm"
                                        variant="flat"
                                    >
                                        {server.hostnameOrIp}
                                    </Snippet>
                                </TableCell>
                                <TableCell>
                                    <Chip color="default" size="sm" variant="flat">
                                        {server._count?.accessKeys}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Chip color="default" size="sm" variant="flat">
                                        {formatBytes(Number(server.totalDataUsage))}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <Chip color={server.isAvailable ? "success" : "danger"} size="sm" variant="flat">
                                        {server.isAvailable ? "Available" : "Not Available"}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-center items-center">
                                        <Tooltip
                                            closeDelay={100}
                                            color="primary"
                                            content="Server keys"
                                            delay={600}
                                            size="sm"
                                        >
                                            <Button
                                                as={Link}
                                                color="primary"
                                                href={`/servers/${server.id}/access-keys`}
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                            >
                                                <KeyIcon size={24} />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip
                                            closeDelay={100}
                                            color="primary"
                                            content="Server settings"
                                            delay={600}
                                            size="sm"
                                        >
                                            <Button
                                                as={Link}
                                                color="primary"
                                                href={`/servers/${server.id}/settings`}
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                            >
                                                <SettingsIcon size={24} />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip
                                            closeDelay={100}
                                            color="danger"
                                            content="Remove the server"
                                            delay={600}
                                            size="sm"
                                        >
                                            <Button
                                                color="danger"
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                                onPress={() => {
                                                    setServerToRemove(server.id);
                                                    removeServerConfirmModalDisclosure.onOpen();
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
