"use client";

import { Button, Input, Link, Pagination, Tooltip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { range } from "@heroui/shared-utils";
import { NotificationChannel } from "@prisma/client";

import { PAGE_SIZE } from "@/src/core/config";
import HealthCheckListItemSkeleton from "@/src/components/health-check-list-item-skeleton";
import { ArrowLeftIcon, PlusIcon } from "@/src/components/icons";
import { getNotificationChannels, getNotificationChannelsCount } from "@/src/core/actions/notification-channel";

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

                <div className="flex flex-wrap justify-center gap-4">
                    {isLoading && range(1, 6).map((item) => <HealthCheckListItemSkeleton key={item} />)}
                    {!isLoading && channels.map((item) => <div key={item.id}>{item.name}</div>)}
                </div>

                {!isLoading && totalPage > 1 && channels.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination initialPage={page} total={totalPage} variant="light" onChange={setPage} />
                    </div>
                )}
            </div>
        </>
    );
}
