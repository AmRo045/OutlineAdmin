"use client";

import { Divider, Tooltip } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import React from "react";

import { ArrowLeftIcon } from "@/components/icons";

export default function ServerSettingsPage() {
    return (
        <div className="grid gap-6">
            <section className="flex justify-start items-center gap-2">
                <Tooltip closeDelay={100} color="default" content="Servers" delay={600} size="sm">
                    <Button as={Link} href="/servers" isIconOnly={true} size="sm" variant="light">
                        <ArrowLeftIcon size={20} />
                    </Button>
                </Tooltip>

                <h1 className="text-xl">Server Settings</h1>
            </section>

            <form className="px-10 grid gap-4">
                <span className="text-lg">Editable Information</span>
                <Input
                    className="w-[320px]"
                    description="Set a new name for your server. Note that this will not be reflected on the devices of the users that you invited to connect to it"
                    label="Server name"
                    required={true}
                    size="sm"
                    variant="faded"
                />

                <Input
                    className="w-[320px]"
                    description="This will not affect the existing access keys"
                    label="Hostname or IP for new access keys"
                    required={true}
                    size="sm"
                    variant="faded"
                />

                <Input
                    className="w-[320px]"
                    description="This will not affect the existing access keys"
                    label="Port for new access keys (Max: 65535)"
                    required={true}
                    size="sm"
                    variant="faded"
                />

                <Button className="w-fit" color="primary" type="submit" variant="shadow">
                    Save
                </Button>
            </form>

            <Divider />

            <form className="px-10 grid gap-4">
                <span className="text-lg">Remove The Server</span>
                <p className="text-default-500 text-sm">
                    Please note that this action will only remove the server from the {process.env.APP_NAME}'s database.
                    The server itself will not be affected.
                </p>
                <Button className="w-fit" color="danger" type="submit" variant="shadow">
                    Remove
                </Button>
            </form>
        </div>
    );
}
