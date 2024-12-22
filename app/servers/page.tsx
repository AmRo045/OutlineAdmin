import { Server } from "@prisma/client";

import ServersList from "@/components/servers-list";
import { getServers } from "@/core/actions/server";

export default async function ServersPage() {
    const servers: Server[] = await getServers({}, true);

    return <ServersList data={servers} />;
}
