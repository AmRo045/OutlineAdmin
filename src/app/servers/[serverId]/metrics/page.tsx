import React from "react";
import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import ServerMetrics from "@/src/components/server-metrics";

interface Props {
    params: { serverId: string };
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: createPageTitle("Server Metrics")
};

export default async function ServerMetricsPage({ params }: Props) {
    // const server = await getServerByIdWithTags(parseInt(params.serverId));
    //
    // if (!server) {
    //     notFound();
    // }

    // return <ServerMetrics server={server} />;
    return <ServerMetrics />;
}
