"use client";

import {
    Button,
    Input,
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
import { useForm } from "react-hook-form";
import { NotificationChannel } from "@prisma/client";

import { PAGE_SIZE } from "@/src/core/config";
import { ArrowLeftIcon, DeleteIcon, EditIcon, PlusIcon } from "@/src/components/icons";
import {
    deleteNotificationChannel,
    getNotificationChannels,
    getNotificationChannelsCount
} from "@/src/core/actions/notification-channel";
import NoResult from "@/src/components/no-result";
import ConfirmModal from "@/src/components/modals/confirm-modal";

interface Props {
    data: NotificationChannel[];
}

interface SearchFormProps {
    term: string;
}

export default function NotificationChannelsList({ data }: Props) {
    const [channels, setChannels] = useState<NotificationChannel[]>(data);
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [channel, setChannel] = useState<NotificationChannel>();
    const deleteConfirmModalDisclosure = useDisclosure();

    const handleDelete = async () => {
        if (!channel) return;

        await deleteNotificationChannel(channel.id);
        await updateData();
    };

    const totalPage = Math.ceil(totalItems / PAGE_SIZE);

    const searchForm = useForm<SearchFormProps>();
    const handleSearch = async (data: SearchFormProps) => {
        const params = {
            term: data.term
        };

        const filteredServers = await getNotificationChannels(params);
        const total = await getNotificationChannelsCount(params);

        setTotalItems(total);
        setChannels(filteredServers);
        setPage(1);
    };

    const updateData = async () => {
        const params = { skip: (page - 1) * PAGE_SIZE, term: searchForm.getValues("term") };

        setIsLoading(true);

        try {
            const data = await getNotificationChannels(params);

            setChannels(data);

            const count = await getNotificationChannelsCount(params);

            setTotalItems(count);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        updateData();
    }, [page]);

    return (
        <>
            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>
                            Are you sure you want to delete <q>{channel?.name}</q> notification channel?
                        </span>
                    </div>
                }
                confirmLabel="Remove"
                disclosure={deleteConfirmModalDisclosure}
                title="Delete Notification Channel"
                onConfirm={handleDelete}
            />

            <div className="grid gap-4">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Health checks" delay={600} size="sm">
                        <Button isIconOnly as={Link} href="/health-checks" size="sm" variant="light">
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl">Your Notification Channels</h1>
                </section>

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
                        as={Link}
                        color="primary"
                        href="/health-checks/notification-channels/create"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                    >
                        Add
                    </Button>
                </div>

                <Table
                    aria-label="Servers list"
                    bottomContent={
                        totalPage > 1 && (
                            <div className="flex justify-center">
                                <Pagination initialPage={page} total={totalPage} variant="light" onChange={setPage} />
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
                        <TableColumn>TYPE</TableColumn>
                        <TableColumn align="center">ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={<NoResult />} isLoading={isLoading} loadingContent={<Spinner />}>
                        {channels.map((channel) => (
                            <TableRow key={channel.id}>
                                <TableCell>{channel.id}</TableCell>
                                <TableCell>{channel.name}</TableCell>
                                <TableCell>{channel.type}</TableCell>

                                <TableCell>
                                    <div className="flex gap-2 justify-center items-center">
                                        <Tooltip closeDelay={100} color="primary" content="Edit" delay={600} size="sm">
                                            <Button
                                                as={Link}
                                                color="primary"
                                                href={`/notification-channels/${channel.id}/edit`}
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                            >
                                                <EditIcon size={24} />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip closeDelay={100} color="danger" content="Delete" delay={600} size="sm">
                                            <Button
                                                color="danger"
                                                isIconOnly={true}
                                                size="sm"
                                                variant="light"
                                                onPress={() => {
                                                    setChannel(() => channel);
                                                    deleteConfirmModalDisclosure.onOpen();
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
