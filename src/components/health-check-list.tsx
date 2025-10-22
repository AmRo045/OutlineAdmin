"use client";

import { Button, Input, Link, Pagination } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { range } from "@heroui/shared-utils";

import { HealthCheckWithServerAndChannel } from "@/src/core/definitions";
import { PAGE_SIZE } from "@/src/core/config";
import { getHealthChecks, getHealthChecksCount } from "@/src/core/actions/health-check";
import HealthCheckListItem from "@/src/components/health-check-list-item";
import HealthCheckListItemSkeleton from "@/src/components/health-check-list-item-skeleton";
import { BellIcon } from "@/src/components/icons";

interface SearchFormProps {
    term: string;
}

export default function HealthCheckList() {
    const [healthChecks, setHealthChecks] = useState<HealthCheckWithServerAndChannel[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const totalPage = Math.ceil(totalItems / PAGE_SIZE);

    const searchForm = useForm<SearchFormProps>();
    const handleSearch = async (data: SearchFormProps) => {
        const params = {
            term: data.term
        };

        const filteredServers = await getHealthChecks(params);
        const total = await getHealthChecksCount(params);

        setTotalItems(total);
        setHealthChecks(filteredServers);
        setPage(1);
    };

    const updateData = async (quietly: boolean = false) => {
        const params = { skip: (page - 1) * PAGE_SIZE, term: searchForm.getValues("term") };

        if (!quietly) {
            setIsLoading(true);
        }

        try {
            const data = await getHealthChecks(params);

            setHealthChecks(data);

            const count = await getHealthChecksCount(params);

            setTotalItems(count);
        } finally {
            if (!quietly) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        updateData();

        const interval = setInterval(() => updateData(true), 30 * 1000);

        return () => clearInterval(interval);
    }, [page]);

    return (
        <>
            <div className="grid gap-4">
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl">Your Health Checks</h1>
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
                        as={Link}
                        color="primary"
                        href="/health-checks/notification-channels"
                        startContent={<BellIcon size={20} />}
                        variant="shadow"
                    >
                        Channels
                    </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {isLoading && range(1, 6).map((item) => <HealthCheckListItemSkeleton key={item} />)}
                    {!isLoading && healthChecks.map((item) => <HealthCheckListItem key={item.id} item={item} />)}
                </div>

                {!isLoading && totalPage > 1 && healthChecks.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination initialPage={page} total={totalPage} variant="light" onChange={setPage} />
                    </div>
                )}
            </div>
        </>
    );
}
