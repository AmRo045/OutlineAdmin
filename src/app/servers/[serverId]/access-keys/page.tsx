import { notFound } from "next/navigation";
import { Metadata } from "next";

import ServerAccessKeys from "@/src/components/server-access-keys";
import { getServerByIdWithTags } from "@/src/core/actions/server";
import { getAccessKeysCount } from "@/src/core/actions/access-key";
import { createPageTitle } from "@/src/core/utils";

export const metadata: Metadata = {
    title: createPageTitle("Server Access Keys")
};

interface Props {
    params: {
        serverId: string;
    };
}

export default async function ServerAccessKeysPage({ params }: Props) {
    const server = await getServerByIdWithTags(parseInt(params.serverId));

    if (!server) {
        notFound();
    }

    const totalAccessKeys = await getAccessKeysCount(server.id);

    return <ServerAccessKeys server={server} total={totalAccessKeys} />;
}
