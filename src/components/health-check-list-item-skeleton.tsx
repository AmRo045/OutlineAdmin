import { Card, CardBody, CardFooter, CardHeader, Divider, Skeleton } from "@heroui/react";
import React from "react";

export default function HealthCheckListItemSkeleton() {
    return (
        <Card className="w-[320px]">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded-xl w-[200px] h-4" />
                    <Skeleton className="rounded-xl w-[120px] h-3" />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid gap-2 text-sm">
                    <Skeleton className="rounded-xl w-full h-4" />

                    <Skeleton className="rounded-xl w-full h-4" />

                    <Skeleton className="rounded-xl w-full h-4" />

                    <Skeleton className="rounded-xl w-full h-4" />
                </div>
            </CardBody>
            <Divider />
            <CardFooter>
                <Skeleton className="rounded-xl w-full h-[40px]" />
            </CardFooter>
        </Card>
    );
}
