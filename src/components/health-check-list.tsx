"use client";

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    Input,
    Pagination,
    Radio,
    RadioGroup,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HealthCheck } from "@prisma/client";
import { range } from "@heroui/shared-utils";

import { HealthCheckWithServer } from "@/src/core/definitions";
import { PAGE_SIZE } from "@/src/core/config";
import { getHealthChecks, getHealthChecksCount } from "@/src/core/actions/health-check";
import HealthCheckListItem from "@/src/components/health-check-list-item";
import HealthCheckListItemSkeleton from "@/src/components/health-check-list-item-skeleton";

interface SearchFormProps {
    term: string;
}

const temp = [
    {
        id: 1,
        server: {
            name: "ParsPack - Frankfurt / DC: DE-DC1",
            hostname: "185.208.172.209"
        },
        lastCheckedAt: "16:50",
        isAvailable: true,
        notification: "Telegram",
        notificationCooldown: 5,
        interval: 1
    },
    {
        id: 2,
        name: "IRAN ParsVDS - IR_VPS_e2_Nvme",
        hostname: "194.60.231.105",
        lastCheckedAt: "15:50",
        isAvailable: false,
        notification: "Shell script",
        notificationCooldown: 5,
        interval: 5
    }
];

export default function HealthCheckList() {
    const [healthChecks, setHealthChecks] = useState<HealthCheckWithServer[]>([]);
    const [currentHealthCheck, setCurrentHealthCheck] = useState<HealthCheck>();
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const totalPage = Math.ceil(totalItems / PAGE_SIZE);

    const healthCheckFormDrawerDisclosure = useDisclosure();
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

    const updateData = async () => {
        const params = { skip: (page - 1) * PAGE_SIZE, term: searchForm.getValues("term") };

        setIsLoading(true);

        try {
            const data = await getHealthChecks(params);

            setHealthChecks(data);

            const count = await getHealthChecksCount(params);

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
            <Drawer
                backdrop="blur"
                isOpen={healthCheckFormDrawerDisclosure.isOpen}
                radius="none"
                onOpenChange={healthCheckFormDrawerDisclosure.onOpenChange}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Health check edit form</DrawerHeader>
                            <DrawerBody>
                                <form className="grid gap-4">
                                    <RadioGroup label="Notification type">
                                        <Radio value="telegram">Telegram</Radio>
                                        <Radio value="endpoint">Endpoint</Radio>
                                        <Radio value="script">Script</Radio>
                                    </RadioGroup>

                                    <Input
                                        label="Notification cooldown (minute)"
                                        placeholder="e.g. 60"
                                        type="number"
                                        variant="underlined"
                                    />
                                    <Input
                                        label="Notification interval (minute)"
                                        placeholder="e.g. 5"
                                        type="number"
                                        variant="underlined"
                                    />
                                </form>
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

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
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {isLoading && range(1, 5).map((item, index) => <HealthCheckListItemSkeleton key={item} />)}
                    {!isLoading &&
                        healthChecks.map((item, index) => (
                            <HealthCheckListItem
                                key={item.id}
                                item={item}
                                onEdit={(item) => {
                                    setCurrentHealthCheck(undefined);
                                    healthCheckFormDrawerDisclosure.onOpen();
                                }}
                            />
                        ))}
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
