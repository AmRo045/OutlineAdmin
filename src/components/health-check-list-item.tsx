import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider } from "@heroui/react";
import React from "react";

import { HealthCheckWithServer } from "@/src/core/definitions";

interface Props {
    item: HealthCheckWithServer;
}

export default function HealthCheckListItem({ item }: Props) {
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
                            {item.lastCheckedAt?.toLocaleString() ?? "Not Checked Yet"}
                        </Chip>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>Interval:</span>
                        <Chip size="sm" variant="flat">
                            Every {item.interval} minutes
                        </Chip>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <span>Notification:</span>
                        <Chip size="sm" variant="flat">
                            {item.notification ?? "NONE"}
                        </Chip>
                    </div>
                </div>
            </CardBody>
            <Divider />
            <CardFooter>
                <Button fullWidth={true} variant="flat">
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
}
