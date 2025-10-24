import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getServerById } from "@/src/core/actions/server";
import ServerEditForm from "@/src/components/server-edit-form";
import { createPageTitle } from "@/src/core/utils";

interface Props {
    params: { serverId: string };
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: createPageTitle("Server Settings")
};

export default async function ServerSettingsPage({ params }: Props) {
    const server = await getServerById(parseInt(params.serverId));

    if (!server) {
        notFound();
    }

    return <ServerEditForm server={server} />;
}
