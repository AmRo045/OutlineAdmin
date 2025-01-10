import { Divider } from "@nextui-org/react";
import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";

export const metadata: Metadata = {
    title: createPageTitle("404 Not Found")
};

export default function NotFoundPage() {
    return (
        <div className="flex flex-col gap-4 h-full justify-center items-center">
            <div className="text-6xl font-cursive text-foreground-500">¯\_(ツ)_/¯</div>
            <Divider className="opacity-65 w-[264px] mt-4" />
            <div className="text-2xl text-foreground-500">404 - NOT FOUND</div>
        </div>
    );
}
