import { Chip, Snippet, Tooltip } from "@nextui-org/react";
import React from "react";

import { CopyIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function ServerInfo() {
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
                    letkot.vpn.app
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
                    4365
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
                    1.7.2
                </Chip>
            </div>

            <div className="flex justify-between items-center gap-2 col-span-2 md:col-span-1">
                <span className="text-sm text-default-500">Number of keys</span>
                <Chip size="sm" variant="flat">
                    124
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
                        2024-05-12 16:23:16
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
                    title={"https://95.164.16.160:44816/DIHLzo-LaADa_PmfcVDhYA"}
                    variant="flat"
                >
                    https://95.164.16.160:44816/DIHLzo-LaADa_PmfcVDhYA
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
                    title={siteConfig.snippets.exampleServerConfig}
                    variant="flat"
                >
                    {siteConfig.snippets.exampleServerConfig}
                </Snippet>
            </div>
        </section>
    );
}
