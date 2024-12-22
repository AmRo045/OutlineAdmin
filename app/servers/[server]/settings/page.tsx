import React from "react";
import { notFound } from "next/navigation";

import { getServerById } from "@/core/actions/server";
import ServerEditForm from "@/components/server-edit-form";

interface Props {
    params: { server: string };
}

export const dynamic = "force-dynamic";

export default async function ServerSettingsPage({ params }: Props) {
    const server = await getServerById(parseInt(params.server));

    if (!server) {
        notFound();
    }

    return <ServerEditForm server={server} />;
}
