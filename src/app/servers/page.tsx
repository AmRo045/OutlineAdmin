import { Metadata } from "next";

import ServersList from "@/src/components/servers-list";
import { getServersWithTags } from "@/src/core/actions/server";
import { createPageTitle } from "@/src/core/utils";

export const metadata: Metadata = {
    title: createPageTitle("Servers")
};

export default async function ServersPage() {
    const servers = await getServersWithTags({}, true);

    return <ServersList data={servers} />;
}
