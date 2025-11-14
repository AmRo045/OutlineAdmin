import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from "@heroui/react";
import React from "react";

import { HealthCheckWithServerAndChannel } from "@/src/core/definitions";

interface Props {
    item: HealthCheckWithServerAndChannel;
}

export default function HealthCheckListItem({ item }: Props) {
    const renderChannelName = () => {
        if (!item.notificationChannel || item.notificationChannel.type === "None") {
            return "No Notification";
        }

        return item.notificationChannel.name + " (" + item.notificationChannel.type + ")";
    };

    return (
        <Card className="w-[320px]">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md">{item.server.name}</p>
                    <p className="text-small text-default-500">{item.server.hostnameOrIp}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid gap-2 text-sm">
                    <div className="flex justify-between items-center gap-2">
                        <span>Status:</span>
                        {item.isAvailable ? (
                            <Chip color="success" radius="sm" size="sm" variant="flat">
                                Available
                            </Chip>
                        ) : (
                            <Chip color="danger" radius="sm" size="sm" variant="flat">
                                Not Available
                            </Chip>
                        )}
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>Last check:</span>
                        <Chip radius="sm" size="sm" variant="flat">
                            {item.lastCheckedAt?.toLocaleString() ?? "Not Checked Yet"}
                        </Chip>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>Interval:</span>
                        <Chip radius="sm" size="sm" variant="flat">
                            Every {item.interval}m
                        </Chip>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>Notification:</span>
                        <Chip radius="sm" size="sm" variant="flat">
                            {renderChannelName()}
                        </Chip>
                    </div>
                </div>
            </CardBody>
            <Divider />
            <CardFooter>
                <Button as={Link} fullWidth={true} href={`/health-checks/${item.id}`} variant="flat">
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
}
