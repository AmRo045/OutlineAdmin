import { notFound } from "next/navigation";

import ServerAccessKeys from "@/components/server-access-keys";
import { getServerById } from "@/core/actions/server";

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

    return <ServerAccessKeys server={server} />;
}
