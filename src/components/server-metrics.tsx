"use client";

import { Alert, Button, Card, CardBody, CardHeader, Chip, Divider, Link, Skeleton, Tooltip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Server } from "@prisma/client";
import { range } from "@heroui/shared-utils";

import { ArrowLeftIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";
import { Outline } from "@/src/core/definitions";
import { getServerMetrics } from "@/src/core/actions/server";
import { countryCodeToFlag, formatAdaptiveTime, formatBytes, formatTimestamp } from "@/src/core/utils";

interface Props {
    server: Server;
}

export default function ServerMetrics({ server }: Props) {
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("return");

    const [metrics, setMetrics] = useState<Outline.Experimental.Metrics | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadMetrics = async (quietly: boolean = false) => {
        if (quietly) {
            setMetrics(await getServerMetrics(server));
        } else {
            setIsLoading(true);

            setMetrics(await getServerMetrics(server));

            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();

        const refreshInterval = setInterval(() => loadMetrics(true), 10000);

        return () => clearInterval(refreshInterval);
    }, []);

    const hasNoData = !isLoading && !metrics;

    return (
        <>
            <div className="grid gap-6">
                <section className="flex justify-start items-center gap-2">
                    <Tooltip closeDelay={100} color="default" content="Back" delay={600} size="sm">
                        <Button
                            as={Link}
                            href={returnUrl ? returnUrl : "/servers"}
                            isIconOnly={true}
                            size="sm"
                            variant="light"
                        >
                            <ArrowLeftIcon size={20} />
                        </Button>
                    </Tooltip>

                    <h1 className="text-xl break-word">
                        {server.name} ({server.hostnameOrIp}) Metrics
                    </h1>
                </section>

                <section className="grid gap-4 xl:px-4">
                    <p className="text-foreground-500">
                        We are committed to protecting the privacy and security of our users. Each Outline server
                        automatically collects aggregated and anonymized usage data. This data does not include
                        information about the websites users visit or their communications. It is also not shared with
                        the Outline team unless you, as the server administrator, explicitly opt in to sharing.{" "}
                        <Link href={app.links.outlineVpn.dataCollectionPolicy} target="_blank">
                            Learn more
                        </Link>
                    </p>

                    {hasNoData && <Alert color="danger">Failed to fetch server metrics.</Alert>}

                    {isLoading && (
                        <div className="grid gap-4">
                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <Card className="bg-transparent" shadow="none">
                                        <CardHeader>
                                            <Skeleton className="w-[200px] h-4 rounded-lg" />
                                        </CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Skeleton className="w-[58px] h-[32px] rounded-full" />

                                            <Skeleton className="w-[300px] h-4 rounded-lg" />
                                        </CardBody>
                                    </Card>

                                    <Divider className="bg-content3 dark:bg-content3/40 md:hidden" />

                                    <Card className="bg-content2 dark:bg-content1" shadow="none">
                                        <CardHeader className="flex justify-between gap-2">
                                            <Skeleton className="w-[200px] h-4 rounded-lg" />
                                            <Skeleton className="w-[42px] h-[24px] rounded-full" />
                                        </CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Skeleton className="w-[58px] h-[32px] rounded-full" />

                                            <Skeleton className="w-[200px] h-4 rounded-lg" />
                                        </CardBody>
                                    </Card>
                                </div>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>
                                        <Skeleton className="w-[350px] h-4 rounded-lg" />
                                    </CardHeader>

                                    <CardBody>
                                        <div className="flex flex-wrap w-full gap-2">
                                            {range(1, 4).map((item) => (
                                                <Skeleton
                                                    key={item}
                                                    className="w-full md:w-[300px] h-[96px] rounded-xl"
                                                />
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>

                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>
                                        <Skeleton className="w-[280px] h-4 rounded-lg" />
                                    </CardHeader>

                                    <CardBody className="grid gap-2">
                                        <Skeleton className="w-[58px] h-[32px] rounded-full" />
                                    </CardBody>
                                </Card>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>
                                        <Skeleton className="w-[350px] h-4 rounded-lg" />
                                    </CardHeader>

                                    <CardBody className="grid gap-2">
                                        <div className="flex flex-wrap w-full gap-2">
                                            {range(1, 4).map((item) => (
                                                <Skeleton
                                                    key={item}
                                                    className="w-full md:w-[300px] h-[96px] rounded-xl"
                                                />
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>
                        </div>
                    )}

                    {!isLoading && !hasNoData && (
                        <div className="grid gap-4">
                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    <Card className="bg-transparent" shadow="none">
                                        <CardHeader>Total bandwidth usage (last 30 days)</CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Chip color="primary" size="lg" variant="flat">
                                                {formatBytes(metrics!.server.dataTransferred.bytes)}
                                            </Chip>

                                            <span className="text-foreground-400 text-sm">
                                                This shows the total amount of data transferred through the server over
                                                the past 30 days.
                                            </span>
                                        </CardBody>
                                    </Card>

                                    <Divider className="bg-content3 dark:bg-content3/40 md:hidden" />

                                    <Card className="bg-content2 dark:bg-content1" shadow="none">
                                        <CardHeader className="flex justify-between gap-2">
                                            <span>Current bandwidth usage</span>
                                            <Chip color="primary" size="sm" variant="dot">
                                                {formatBytes(metrics!.server.bandwidth.current.data.bytes)}/s
                                            </Chip>
                                        </CardHeader>

                                        <CardBody className="grid gap-2">
                                            <Chip color="primary" size="lg" variant="flat">
                                                {formatBytes(metrics!.server.bandwidth.peak.data.bytes)}/s
                                            </Chip>

                                            <span className="text-foreground-400 text-sm">
                                                {formatTimestamp(metrics!.server.bandwidth.peak.timestamp * 1000)}
                                            </span>
                                        </CardBody>
                                    </Card>
                                </div>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>ASes with most bandwidth usage (last 30 days)</CardHeader>

                                    <CardBody>
                                        <div className="flex flex-wrap w-full gap-2">
                                            {metrics!.server.locations
                                                .filter((l) => l.asn && l.dataTransferred.bytes > 0)
                                                .map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]"
                                                    >
                                                        <span className="text-sm text-foreground-400">
                                                            {location.asOrg}
                                                        </span>

                                                        <div className="flex items-center justify-between gap-2">
                                                            <Chip color="primary" variant="flat">
                                                                {formatBytes(location.dataTransferred.bytes)}
                                                            </Chip>

                                                            <span>
                                                                {location.asn} {countryCodeToFlag(location.location)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>

                            <Card className="bg-content2 dark:bg-content1" shadow="none">
                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>Total Tunnel Time (last 30 days)</CardHeader>

                                    <CardBody className="grid gap-2">
                                        <Chip color="primary" size="lg" variant="flat">
                                            {formatAdaptiveTime(metrics!.server.tunnelTime.seconds)}
                                        </Chip>
                                    </CardBody>
                                </Card>

                                <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                                <Card className="bg-transparent" shadow="none">
                                    <CardHeader>ASes with highest Tunnel Time (last 30 days)</CardHeader>

                                    <CardBody className="grid gap-2">
                                        <div className="flex flex-wrap w-full gap-2">
                                            {metrics!.server.locations
                                                .filter((l) => l.asn && l.dataTransferred.bytes > 0)
                                                .map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]"
                                                    >
                                                        <span className="text-sm text-foreground-400">
                                                            {location.asOrg}
                                                        </span>

                                                        <div className="flex items-center justify-between gap-2">
                                                            <Chip color="primary" variant="flat">
                                                                {formatAdaptiveTime(location.tunnelTime.seconds)}
                                                            </Chip>

                                                            <span>
                                                                {location.asn} {countryCodeToFlag(location.location)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </Card>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
