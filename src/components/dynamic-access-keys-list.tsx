"use client";

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Input,
    Pagination,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicAccessKey } from "@prisma/client";
import { Link } from "@heroui/link";

import ConfirmModal from "@/src/components/modals/confirm-modal";
import { InfinityIcon, InfoIcon, PlusIcon, SelfManagedKeyIcon } from "@/src/components/icons";
import { DataLimitUnit, DynamicAccessKeyWithAccessKeysCount } from "@/src/core/definitions";
import {
    getDynamicAccessKeys,
    getDynamicAccessKeysCount,
    removeDynamicAccessKey
} from "@/src/core/actions/dynamic-access-key";
import DynamicAccessKeyModal from "@/src/components/modals/dynamic-access-key-modal";
import { app, PAGE_SIZE } from "@/src/core/config";
import DynamicAccessKeyValidityChip from "@/src/components/dynamic-access-key-validity-chip";
import DynamicAccessKeysSslWarning from "@/src/components/dynamic-access-keys-ssl-warning";
import { convertDataLimitToUnit, formatBytes } from "@/src/core/utils";

interface SearchFormProps {
    term: string;
}

export default function DynamicAccessKeysList() {
    const [dynamicAccessKeys, setDynamicAccessKeys] = useState<DynamicAccessKeyWithAccessKeysCount[]>([]);
    const [currentDynamicAccessKey, setCurrentDynamicAccessKey] = useState<DynamicAccessKey>();
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const totalPage = Math.ceil(totalItems / PAGE_SIZE);

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

    const renderDataUsageChip = (item: DynamicAccessKey) => {
        const bytesPerMB = 1024 * 1024;
        const dataLimitInBytes = Number(item.dataLimit) * bytesPerMB;
        const isExceeded = item.dataLimit && item.dataUsage >= dataLimitInBytes;

        return (
            <Chip color={isExceeded ? "danger" : "default"} radius="sm" size="sm" variant="flat">
                <div className="flex gap-2 items-center">
                    <span>{formatBytes(Number(item.dataUsage))}</span>

                    {item.isSelfManaged && (
                        <>
                            <span className="text-default-500">of</span>
                            {item.dataLimit ? (
                                <span>
                                    {formatBytes(convertDataLimitToUnit(Number(item.dataLimit), DataLimitUnit.MB))}
                                </span>
                            ) : (
                                <InfinityIcon size={20} />
                            )}
                        </>
                    )}
                </div>
            </Chip>
        );
    };

    return (
        <>
            <DynamicAccessKeyModal disclosure={dynamicAccessKeyModalDisclosure} value={getCurrentAccessKeyUrl()} />

            <ConfirmModal
                body={
                    <div className="grid gap-2">
                        <span>Are you sure you want to Delete this dynamic access key?</span>
                        <p className="text-default-500 text-sm whitespace-pre-wrap break-all">
                            {getCurrentAccessKeyUrl()}
                        </p>
                    </div>
                }
                confirmLabel="Delete"
                disclosure={removeDynamicAccessKeyConfirmModalDisclosure}
                title="Delete Dyanmic Access Key"
                onConfirm={handleRemoveDynamicAccessKey}
            />

            <div className="grid gap-4">
                <div className="flex gap-2 items-center">
                    <h1 className="text-xl">Dynamic Access Keys</h1>

                    <Tooltip content="Read more about dynamic access keys">
                        <Link href={app.links.outlineVpnWiki.dynamicAccessKeys} target="_blank">
                            <InfoIcon size={20} />
                        </Link>
                    </Tooltip>
                </div>

                <DynamicAccessKeysSslWarning />

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
                        href="/dynamic-access-keys/create"
                        startContent={<PlusIcon size={20} />}
                        variant="shadow"
                    >
                        Create
                    </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {dynamicAccessKeys.map((item) => (
                        <Card key={item.id} className="w-[340px]">
                            <CardHeader>
                                <div className="grid gap-1">
                                    <span className="max-w-[320px] truncate">{item.name}</span>
                                    <span className="max-w-[320px] truncate text-foreground-400 text-sm">
                                        {item.path}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardBody className="text-sm grid gap-2">
                                <div className="flex gap-1 justify-between items-center">
                                    <span>ID</span>
                                    <Chip radius="sm" size="sm" variant="flat">
                                        {item.id}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Management type</span>
                                    {item.isSelfManaged ? (
                                        <Chip color="secondary" radius="sm" size="sm" variant="flat">
                                            Self-Managed
                                        </Chip>
                                    ) : (
                                        <Chip color="default" radius="sm" size="sm" variant="flat">
                                            Manual
                                        </Chip>
                                    )}
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Data usage</span>
                                    {renderDataUsageChip(item)}
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Number of keys</span>
                                    <Chip
                                        color="default"
                                        radius="sm"
                                        size="sm"
                                        startContent={item.isSelfManaged && <SelfManagedKeyIcon size={18} />}
                                        variant="flat"
                                    >
                                        {item.isSelfManaged ? <span>Auto</span> : item._count?.accessKeys}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Load balancer</span>
                                    <Chip color="default" radius="sm" size="sm" variant="flat">
                                        {item.loadBalancerAlgorithm}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Prefix</span>
                                    <Chip
                                        color={item.prefix ? "success" : "default"}
                                        radius="sm"
                                        size="sm"
                                        variant="flat"
                                    >
                                        {item.prefix ? item.prefix : "None"}
                                    </Chip>
                                </div>

                                <div className="flex gap-1 justify-between items-center">
                                    <span>Validity</span>
                                    <DynamicAccessKeyValidityChip dak={item} />
                                </div>
                            </CardBody>
                            <CardFooter>
                                <ButtonGroup color="default" fullWidth={true} size="sm" variant="flat">
                                    <Button
                                        onPress={() => {
                                            setCurrentDynamicAccessKey(() => item);
                                            dynamicAccessKeyModalDisclosure.onOpen();
                                        }}
                                    >
                                        QR Code
                                    </Button>

                                    <Button
                                        as={Link}
                                        href={`/dynamic-access-keys/${item.id}/access-keys`}
                                        isDisabled={item.isSelfManaged}
                                    >
                                        Access Keys
                                    </Button>

                                    <Button as={Link} href={`/dynamic-access-keys/${item.id}/edit`}>
                                        Edit
                                    </Button>

                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            setCurrentDynamicAccessKey(() => item);
                                            removeDynamicAccessKeyConfirmModalDisclosure.onOpen();
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {totalPage > 1 && dynamicAccessKeys.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination initialPage={page} total={totalPage} variant="light" onChange={setPage} />
                    </div>
                )}
            </div>
        </>
    );
}
