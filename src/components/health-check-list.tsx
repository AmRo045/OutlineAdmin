"use client";

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Divider,
    Input,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicAccessKey } from "@prisma/client";

import ConfirmModal from "@/src/components/modals/confirm-modal";
import { PlusIcon } from "@/src/components/icons";
import { DynamicAccessKeyWithAccessKeysCount } from "@/src/core/definitions";
import {
    getDynamicAccessKeys,
    getDynamicAccessKeysCount,
    removeDynamicAccessKey
} from "@/src/core/actions/dynamic-access-key";
import { PAGE_SIZE } from "@/src/core/config";

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
    const [dynamicAccessKeys, setDynamicAccessKeys] = useState<DynamicAccessKeyWithAccessKeysCount[]>([]);
    const [currentDynamicAccessKey, setCurrentDynamicAccessKey] = useState<DynamicAccessKey>();
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const totalPage = Math.ceil(totalItems / PAGE_SIZE);

    const dynamicAccessKeyFormModalDisclosure = useDisclosure();
    const removeDynamicAccessKeyConfirmModalDisclosure = useDisclosure();
    const dynamicAccessKeyModalDisclosure = useDisclosure();

    const searchForm = useForm<SearchFormProps>();
    const handleSearch = async (data: SearchFormProps) => {
        const params = {
            term: data.term
        };

        const filteredServers = await getDynamicAccessKeys(params, true);
        const total = await getDynamicAccessKeysCount(params);

        setTotalItems(total);
        setDynamicAccessKeys(filteredServers);
        setPage(1);
    };

    const handleRemoveDynamicAccessKey = async () => {
        if (!currentDynamicAccessKey) return;

        await removeDynamicAccessKey(currentDynamicAccessKey.id);
        await updateData();
    };

    const getCurrentAccessKeyUrl = () => {
        if (!currentDynamicAccessKey) return;

        const swappedProtocol = window.location.origin.replace("http://", "ssconf://").replace("https://", "ssconf://");
        const name = encodeURIComponent(currentDynamicAccessKey.name);

        return `${swappedProtocol}/api/dak/${currentDynamicAccessKey.path}#${name}`;
    };

    const updateData = async () => {
        const params = { skip: (page - 1) * PAGE_SIZE, term: searchForm.getValues("term") };

        setIsLoading(true);

        try {
            const data = await getDynamicAccessKeys(params, true);

            setDynamicAccessKeys(data);

            const count = await getDynamicAccessKeysCount(params);

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
                        <span>Are you sure you want to delete this health-check?</span>
                        <p className="text-default-500 text-sm whitespace-pre-wrap break-all">Test value</p>
                    </div>
                }
                confirmLabel="Remove"
                disclosure={removeDynamicAccessKeyConfirmModalDisclosure}
                title="Remove Health Check"
                onConfirm={handleRemoveDynamicAccessKey}
            />

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
                        color="primary"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                        onPress={() => {
                            setCurrentDynamicAccessKey(undefined);
                            dynamicAccessKeyFormModalDisclosure.onOpen();
                        }}
                    >
                        Create
                    </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {temp.map((item, index) => (
                        <Card key={index} className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                <div className="flex flex-col">
                                    <p className="text-md">{item.name}</p>
                                    <p className="text-small text-default-500">{item.hostname}</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="grid gap-2 text-sm">
                                    <div className="flex justify-between items-center gap-2">
                                        <span>Status:</span>
                                        {item.isAvailable ? (
                                            <Chip color="success" size="sm" variant="flat">
                                                Available
                                            </Chip>
                                        ) : (
                                            <Chip color="danger" size="sm" variant="flat">
                                                Not Available
                                            </Chip>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center gap-2">
                                        <span>Last check:</span>
                                        <Chip size="sm" variant="flat">
                                            {item.lastCheckedAt}
                                        </Chip>
                                    </div>

                                    <div className="flex justify-between items-center gap-2">
                                        <span>Interval:</span>
                                        <Chip size="sm" variant="flat">
                                            Every {item.interval} minutes
                                        </Chip>
                                    </div>

                                    <Divider />

                                    <div className="flex justify-between items-center gap-2">
                                        <span>Notification:</span>
                                        <Chip size="sm" variant="flat">
                                            {item.notification}
                                        </Chip>
                                    </div>
                                </div>
                            </CardBody>
                            <Divider />
                            <CardFooter>
                                <ButtonGroup fullWidth={true} variant="flat">
                                    <Button>Edit</Button>
                                    <Button color="danger">Delete</Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
