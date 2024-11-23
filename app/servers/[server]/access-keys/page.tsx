"use client";

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
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import React from "react";

import { ArrowLeftIcon, CopyIcon, DeleteIcon, EditIcon, InfinityIcon, KeyIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function ServerAccessKeysPage() {
    return (
        <div className="grid gap-6">
            <section className="flex justify-between items-center gap-2">
                <section className="flex items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                        <Button as={Link} href="/servers" isIconOnly={true} size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">[server_name]</h1>
                </section>

                <Button as={Link} color="primary" href={`/servers/${1}/settings`} variant="light">
                    Settings
                </Button>
            </section>

            <section className="rounded-xl bg-default-100 p-4 grid grid-cols-2 gap-y-2 gap-x-8">
                <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Hostname or IP</span>
                    <Snippet
                        classNames={{
                            base: "!max-w-[300px]",
                            copyButton: "text-sm !min-w-6 !w-6 h-6",
                            pre: "!ps-1 truncate"
                        }}
                        copyIcon={<CopyIcon size={16} />}
                        hideSymbol={true}
                        size="sm"
                        variant="flat"
                    >
                        letkot.vpn.app
                    </Snippet>
                </div>

                <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Port</span>
                    <Snippet
                        classNames={{
                            base: "!max-w-[200px]",
                            copyButton: "text-sm !min-w-6 !w-6 h-6",
                            pre: "!ps-1 truncate"
                        }}
                        copyIcon={<CopyIcon size={16} />}
                        hideSymbol={true}
                        size="sm"
                        variant="flat"
                    >
                        4365
                    </Snippet>
                </div>

                <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Status</span>
                    <Chip color="success" size="sm" variant="flat">
                        AVAILABLE
                    </Chip>
                </div>

                <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Version</span>
                    <Chip size="sm" variant="flat">
                        1.7.2
                    </Chip>
                </div>

                <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Number of keys</span>
                    <Chip size="sm" variant="flat">
                        124
                    </Chip>
                </div>

                <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Total usage</span>
                    <Chip size="sm" variant="flat">
                        1.65 GB
                    </Chip>
                </div>

                <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Creation date</span>
                    <Tooltip closeDelay={200} content="3 weeks ago" delay={600} size="sm">
                        <Chip size="sm" variant="flat">
                            2024-05-12 16:23:16
                        </Chip>
                    </Tooltip>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-2 col-span-2 md:col-span-1">
                    <span className="text-sm text-default-500">Management URL</span>
                    <Snippet
                        classNames={{
                            base: "!max-w-[280px] md:!max-w-[300px]",
                            copyButton: "text-sm !min-w-6 !w-6 h-6",
                            pre: "!ps-1 truncate"
                        }}
                        copyIcon={<CopyIcon size={16} />}
                        hideSymbol={true}
                        size="sm"
                        title={"https://95.164.16.160:44816/DIHLzo-LaADa_PmfcVDhYA"}
                        variant="flat"
                    >
                        https://95.164.16.160:44816/DIHLzo-LaADa_PmfcVDhYA
                    </Snippet>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-2 col-span-2 ">
                    <span className="text-sm text-default-500">Management JSON</span>
                    <Snippet
                        classNames={{
                            base: "!max-w-[280px] md:!max-w-[700px]",
                            copyButton: "text-sm !min-w-6 !w-6 h-6",
                            pre: "!ps-1 truncate"
                        }}
                        copyIcon={<CopyIcon size={16} />}
                        hideSymbol={true}
                        size="sm"
                        title={siteConfig.snippets.exampleServerConfig}
                        variant="flat"
                    >
                        {siteConfig.snippets.exampleServerConfig}
                    </Snippet>
                </div>
            </section>

            <section className="grid gap-6">
                <h1 className="text-xl">🗝️ Access Keys</h1>
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
                        <TableColumn align="center">DATA USAGE</TableColumn>
                        <TableColumn align="center">VALIDITY</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="2">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="3">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="4">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="5">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="6">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="7">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="8">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="9">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="10">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="11">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="12">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow key="13">
                            <TableCell>1</TableCell>
                            <TableCell>England</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2 items-center">
                                    <span>0 B</span>
                                    <span className="text-default-500">of</span>
                                    <InfinityIcon size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="flat">
                                    AVAILABLE
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
                                        <Button color="primary" isIconOnly={true} size="sm" variant="light">
                                            <KeyIcon size={24} />
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
                                            href={`/servers/${1}/access-keys/${2}/edit`}
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
                                        <Button color="danger" isIconOnly={true} size="sm" variant="light">
                                            <DeleteIcon size={24} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </section>
        </div>
    );
}
