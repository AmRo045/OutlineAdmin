"use client";

import { Button, Card, CardBody, CardHeader, Chip, Divider, Link, Tooltip } from "@heroui/react";
import React from "react";
import { useSearchParams } from "next/navigation";

import { ArrowLeftIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";

// interface Props {
//     server: Server;
// }

// export default function ServerMetrics({ server }: Props) {
export default function ServerMetrics() {
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("return");

    // const [metrics, setMetrics] = useState<Outline.Experimental.Metrics | null>();
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    //
    // const loadMetrics = async () => {
    //     setIsLoading(true);
    //
    //     const metrics = await getServerMetrics(server);
    //
    //     setMetrics(metrics);
    //     setIsLoading(false);
    // };
    //
    // useEffect(() => {
    //     loadMetrics();
    // }, []);
    //
    // const hasNoData = !isLoading && !metrics;

    const renderDataVolume = (value: string) => {
        return (
            <span className="bg-primary-100 dark:bg-primary-800 text-primary rounded-full w-fit text-2xl py-1 px-2">
                {value}
            </span>
        );
    };

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

                    {/*<h1 className="text-xl break-word">*/}
                    {/*    {server.name} ({server.hostnameOrIp}) Metrics*/}
                    {/*</h1>*/}
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

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <Card className="bg-content2 dark:bg-content1" shadow="none">
                            <CardHeader>Total bandwidth usage (last 30 days)</CardHeader>

                            <CardBody className="grid gap-2">
                                <Chip color="primary" size="lg" variant="flat">
                                    321.68 GB
                                </Chip>

                                <span className="text-foreground-400 text-sm">
                                    This shows the total amount of data transferred through the server over the past
                                    30 days.
                                </span>
                            </CardBody>
                        </Card>

                        <Card className="bg-content2 dark:bg-content1" shadow="none">
                            <CardHeader className="flex justify-between gap-2">
                                <span>Current bandwidth usage</span>
                                <Chip color="primary" size="sm" variant="dot">
                                    25 kB/s
                                </Chip>
                            </CardHeader>

                            <CardBody className="grid gap-2">
                                <Chip color="primary" size="lg" variant="flat">
                                    13.6 MB/s
                                </Chip>

                                <span className="text-foreground-400 text-sm">11/6/2025, 12:15:00 PM</span>
                            </CardBody>
                        </Card>
                    </div>

                    <Card className="bg-content2 dark:bg-content1" shadow="none">
                        <CardHeader>ASes with most bandwidth usage (last 30 days)</CardHeader>

                        <CardBody>
                            <div className="flex flex-wrap w-full gap-2">
                                <div className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]">
                                    <span className="text-sm text-foreground-400">
                                        Mobile Communication Company of Iran PLC
                                    </span>

                                    <div className="flex items-center justify-between gap-2">
                                        <Chip color="primary" variant="flat">
                                            198.09 GB
                                        </Chip>

                                        <span>AS197207 🇮🇷</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]">
                                    <span className="text-sm text-foreground-400">
                                        Mobile Communication Company of Iran PLC
                                    </span>

                                    <div className="flex items-center justify-between gap-2">
                                        <Chip color="primary" variant="flat">
                                            198.09 GB
                                        </Chip>

                                        <span>AS197207 🇮🇷</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-content2 dark:bg-content1" shadow="none">
                        <Card className="bg-transparent" shadow="none">
                            <CardHeader>Total Tunnel Time (last 30 days)</CardHeader>

                            <CardBody className="grid gap-2">
                                <Chip color="primary" size="lg" variant="flat">
                                    3,449.448 hours
                                </Chip>
                            </CardBody>
                        </Card>

                        <Divider className="bg-content3 dark:bg-content3/40 my-4" />

                        <Card className="bg-transparent" shadow="none">
                            <CardHeader>ASes with highest Tunnel Time (last 30 days)</CardHeader>

                            <CardBody className="grid gap-2">
                                <div className="flex flex-wrap w-full gap-2">
                                    <div className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]">
                                        <span className="text-sm text-foreground-400">
                                            Mobile Communication Company of Iran PLC
                                        </span>

                                        <div className="flex items-center justify-between gap-2">
                                            <Chip color="primary" variant="flat">
                                                198.09 GB
                                            </Chip>

                                            <span>AS197207 🇮🇷</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-background rounded-xl grid gap-4 w-full md:w-[300px]">
                                        <span className="text-sm text-foreground-400">
                                            Mobile Communication Company of Iran PLC
                                        </span>

                                        <div className="flex items-center justify-between gap-2">
                                            <Chip color="primary" variant="flat">
                                                198.09 GB
                                            </Chip>

                                            <span>AS197207 🇮🇷</span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Card>

                    {/*{hasNoData && (*/}
                    {/*    <Alert*/}
                    {/*        color="danger"*/}
                    {/*        endContent={*/}
                    {/*            <Button*/}
                    {/*                as={Link}*/}
                    {/*                className="mt-1"*/}
                    {/*                color="danger"*/}
                    {/*                href={returnUrl ? returnUrl : "/servers"}*/}
                    {/*                size="sm"*/}
                    {/*                variant="light"*/}
                    {/*            >*/}
                    {/*                Back*/}
                    {/*            </Button>*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        Failed to fetch server metrics.*/}
                    {/*    </Alert>*/}
                    {/*)}*/}

                    {/*{isLoading ? (*/}
                    {/*    <span>Loading...</span>*/}
                    {/*) : (*/}
                    {/*    <div>*/}
                    {/*        <pre>{JSON.stringify(metrics, null, 4)}</pre>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </section>
            </div>
        </>
    );
}
