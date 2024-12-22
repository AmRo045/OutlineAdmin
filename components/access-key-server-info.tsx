import { Chip, Snippet, Tooltip } from "@nextui-org/react";
import React from "react";
import { Server } from "@prisma/client";

import { CopyIcon } from "@/components/icons";

interface Props {
    server: Server;
    numberOfKeys: number;
}

export default function AccessKeyServerInfo({ server, numberOfKeys }: Props) {
    return (
        <section className="rounded-xl bg-default-100 p-4 grid grid-cols-2 gap-y-2 gap-x-8">
            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Hostname or IP</span>
                <Snippet
                    classNames={{
                        base: "!max-w-[300px]",
                        copyButton: "text-sm !min-w-6 !w-6 h-6",
                        pre: "!ps-1 truncate"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol={true}
                    size="sm"
                    variant="flat"
                >
                    {server.hostnameOrIp}
                </Snippet>
            </div>

            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Port</span>
                <Snippet
                    classNames={{
                        base: "!max-w-[200px]",
                        copyButton: "text-sm !min-w-6 !w-6 h-6",
                        pre: "!ps-1 truncate"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol={true}
                    size="sm"
                    variant="flat"
                >
                    {server.portForNewAccessKeys}
                </Snippet>
            </div>

            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Status</span>
                <Chip color="success" size="sm" variant="flat">
                    AVAILABLE
                </Chip>
            </div>

            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Version</span>
                <Chip size="sm" variant="flat">
                    {server.version}
                </Chip>
            </div>

            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Number of keys</span>
                <Chip size="sm" variant="flat">
                    {numberOfKeys}
                </Chip>
            </div>

            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Total usage</span>
                <Chip size="sm" variant="flat">
                    1.65 GB
                </Chip>
            </div>

            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Creation date</span>
                <Tooltip closeDelay={200} content="3 weeks ago" delay={600} size="sm">
                    <Chip size="sm" variant="flat">
                        {server.apiCreatedAt.toLocaleDateString()}
                    </Chip>
                </Tooltip>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Management URL</span>
                <Snippet
                    classNames={{
                        base: "!max-w-[280px] md:!max-w-[300px]",
                        copyButton: "text-sm !min-w-6 !w-6 h-6",
                        pre: "!ps-1 truncate"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol={true}
                    size="sm"
                    title={server.apiUrl}
                    variant="flat"
                >
                    {server.apiUrl}
                </Snippet>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 col-span-2 ">
                <span className="text-sm text-default-500">Management JSON</span>
                <Snippet
                    classNames={{
                        base: "!max-w-[280px] md:!max-w-[700px]",
                        copyButton: "text-sm !min-w-6 !w-6 h-6",
                        pre: "!ps-1 truncate"
                    }}
                    copyIcon={<CopyIcon size={16} />}
                    hideSymbol={true}
                    size="sm"
                    title={server.managementJson}
                    variant="flat"
                >
                    {server.managementJson}
                </Snippet>
            </div>
        </section>
    );
}
