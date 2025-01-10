import { Server } from "@prisma/client";
import { Metadata } from "next";

import ServersList from "@/src/components/servers-list";
import { getServers } from "@/src/core/actions/server";
import { createPageTitle } from "@/src/core/utils";

export const metadata: Metadata = {
    title: createPageTitle("Servers")
};

export default async function ServersPage() {
    const servers: Server[] = await getServers({}, true);

    return <ServersList data={servers} />;
}
