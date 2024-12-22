"use client";

import {
    Chip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Server } from "@prisma/client";

import AccessKeyModal from "@/components/modals/access-key-modal";
import AccessKeyFormModal from "@/components/modals/access-key-form-modal";
import ConfirmModal from "@/components/modals/confirm-modal";
import { ArrowLeftIcon, DeleteIcon, EditIcon, EyeIcon, InfinityIcon, PlusIcon } from "@/components/icons";
import ServerInfo from "@/components/access-keys/server-info";

enum AccessKeyFormType {
    New,
    Edit
}

interface Props {
    server: Server;
}

export default function ServerAccessKeys({ server }: Props) {
    const accessKeyFormModalDisclosure = useDisclosure();
    const accessKeyModalDisclosure = useDisclosure();
    const removeAccessKeyConfirmModalDisclosure = useDisclosure();

    const [accessKeyFormType, setAccessKeyFormType] = useState<AccessKeyFormType>(AccessKeyFormType.New);
    const [accessKeyToRemove, setAccessKeyToRemove] = useState<string | null>(null);
    const [currentAccessKey, setCurrentAccessKey] = useState<string>();

    const handleRemoveAccessKey = async () => {
        if (!accessKeyToRemove) return;

        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log(`Removing access key ${accessKeyToRemove}`);
    };

    return (
        <>
            <AccessKeyModal disclosure={accessKeyModalDisclosure} value={currentAccessKey} />

            <AccessKeyFormModal disclosure={accessKeyFormModalDisclosure} type={accessKeyFormType} />

            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>Are you sure you want to remove this access key?</span>
                        <p className="text-default-500 text-sm whitespace-pre-wrap break-all">{accessKeyToRemove}</p>
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

                <ServerInfo server={server} />

                <section className="grid gap-6">
                    <div className="flex justify-between items-center gap-2">
                        <h1 className="text-xl">🗝️ Access Keys</h1>

                        <Button
                            color="primary"
                            startContent={<PlusIcon size={20} />}
                            variant="shadow"
                            onClick={() => {
                                setAccessKeyFormType(AccessKeyFormType.New);
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
                                                onClick={() => {
                                                    setAccessKeyFormType(AccessKeyFormType.Edit);
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
                                                onClick={() => {
                                                    setAccessKeyToRemove(
                                                        "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpFUlNKSVc5MWMwZURPSElTQzlxTjUx@192.168.12.5:23924/?outline=1"
                                                    );
                                                    removeAccessKeyConfirmModalDisclosure.onOpen();
                                                }}
                                            >
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
