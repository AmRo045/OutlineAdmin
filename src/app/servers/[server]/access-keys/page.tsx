import { notFound } from "next/navigation";

import ServerAccessKeys from "@/src/components/server-access-keys";
import { getServerById } from "@/src/core/actions/server";
import { getAccessKeys } from "@/src/core/actions/access-key";

interface Props {
    params: {
        server: string;
    };
}

export default async function ServerAccessKeysPage({ params }: Props) {
    const server = await getServerById(parseInt(params.server));

    if (!server) {
        notFound();
    }

    const accessKeys = await getAccessKeys(server.id);

    return <ServerAccessKeys accessKeys={accessKeys} server={server} />;
}
