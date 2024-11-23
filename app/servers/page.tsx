"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
    Chip,
    Pagination,
    Snippet,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip
} from "@nextui-org/react";
import React from "react";
import { Link } from "@nextui-org/link";

import { CopyIcon, DeleteIcon, KeyIcon, PlusIcon, SettingsIcon } from "@/components/icons";

export default function ServersPage() {
    return (
        <div className="grid gap-4">
            <h1 className="text-xl">Your Servers</h1>

            <div className="flex justify-between items-center gap-2">
                <Input className="w-fit" placeholder="Name or IP [+Enter]" startContent={<>🔍</>} variant="faded" />

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
                bottomContent={
                    <div className="flex justify-center">
                        <Pagination page={1} total={3} variant="light" />
                    </div>
                }
                color="primary"
                isCompact={false}
                isHeaderSticky={true}
                isStriped={true}
                shadow="sm"
            >
                <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>HOSTNAME OR IP</TableColumn>
                    <TableColumn align="center">NUMBER OF KEYS</TableColumn>
                    <TableColumn align="center">TOTAL USAGE</TableColumn>
                    <TableColumn align="center">STATUS</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow key="1">
                        <TableCell>1</TableCell>
                        <TableCell>England</TableCell>
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
                                letkot.vpn.app
                            </Snippet>
                        </TableCell>
                        <TableCell>
                            <Chip color="default" size="sm" variant="flat">
                                24
                            </Chip>
                        </TableCell>
                        <TableCell>
                            <Chip color="default" size="sm" variant="flat">
                                1.52 GB
                            </Chip>
                        </TableCell>
                        <TableCell>
                            <Chip color="success" size="sm" variant="flat">
                                AVAILABLE
                            </Chip>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2 justify-center items-center">
                                <Tooltip closeDelay={100} color="primary" content="Server keys" delay={600} size="sm">
                                    <Button color="primary" isIconOnly={true} size="sm" variant="light">
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
                                        href={`/servers/${1}/settings`}
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
                                    <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                        <DeleteIcon size={24} />
                                    </Button>
                                </Tooltip>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
