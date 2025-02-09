"use client";

import { useEffect } from "react";
import { Button, Divider } from "@heroui/react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        /* eslint-disable no-console */
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col gap-4 h-full justify-center items-center">
            <div className="text-6xl font-cursive text-foreground-500">(ó﹏ò｡)</div>
            <Divider className="opacity-65 w-[264px] mt-4" />
            <div className="text-2xl text-foreground-500">500 - SERVER ERROR</div>
            <Button variant="light" onPress={() => reset()}>
                Try Again
            </Button>
        </div>
    );
}
