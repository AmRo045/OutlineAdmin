"use client";

import {
    Chip,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import React, { useState } from "react";

import { ArrowLeftIcon, DeleteIcon, EditIcon, InfinityIcon, KeyIcon } from "@/components/icons";
import AccessKeyModal from "@/components/modals/access-key-modal";
import ServerInfo from "@/components/access-keys/server-info";

export default function ServerAccessKeysPage() {
    const accessKeyModalDisclosure = useDisclosure();

    const [currentAccessKey, setCurrentAccessKey] = useState<string>();

    return (
        <>
            <AccessKeyModal disclosure={accessKeyModalDisclosure} value={currentAccessKey} />

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

                <ServerInfo />

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
                                            <Button
                                                color="primary"
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                                onClick={() => {
                                                    setCurrentAccessKey(
                                                        "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpFUlNKSVc5MWMwZURPSElTQzlxTjUx@192.168.12.5:23924/?outline=1"
                                                    );
                                                    accessKeyModalDisclosure.onOpen();
                                                }}
                                            >
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
        </>
    );
}
