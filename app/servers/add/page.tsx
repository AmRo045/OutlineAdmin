"use client";

import React from "react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Snippet, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { Input } from "@nextui-org/input";

import { ArrowLeftIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function AddServerPage() {
    return (
        <div className="grid gap-6">
            <section className="flex justify-start items-center gap-2">
                <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                    <Button as={Link} href="/servers" isIconOnly={true} size="sm" variant="light">
                        <ArrowLeftIcon size={20} />
                    </Button>
                </Tooltip>

                <h1 className="text-xl">Add Outline Server</h1>
            </section>

            <section className="px-10 grid gap-2">
                <Tabs>
                    <Tab title="New Server">
                        <div className="grid gap-2">
                            <p className="text-sm text-default-500">Log into your VPN server and run this command</p>
                            <Snippet
                                classNames={{
                                    pre: "!whitespace-pre-line"
                                }}
                                color="default"
                                variant="flat"
                            >
                                {siteConfig.snippets.newOutlineServer}
                            </Snippet>
                        </div>
                    </Tab>

                    <Tab title="Existing Server">
                        <div className="grid gap-2">
                            <p className="text-sm text-default-500">Log into your VPN server and run this command</p>
                            <Snippet
                                classNames={{
                                    pre: "!whitespace-pre-line"
                                }}
                                color="default"
                                variant="flat"
                            >
                                {siteConfig.snippets.existingServer}
                            </Snippet>
                        </div>
                    </Tab>
                </Tabs>
            </section>

            <section className="px-10 grid gap-2">
                <form className="grid gap-4">
                    <Input
                        color="primary"
                        label="Paste your installation output here"
                        placeholder={siteConfig.snippets.exampleServerConfig}
                        required={true}
                        variant="faded"
                    />

                    <div className="flex gap-2 justify-between">
                        <Button className="w-fit" color="primary" type="submit" variant="shadow">
                            Add
                        </Button>

                        <Button as={Link} className="w-fit" href="/servers" variant="flat">
                            Cancel
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
