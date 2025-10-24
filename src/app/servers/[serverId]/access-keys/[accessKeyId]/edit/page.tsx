import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import AccessKeyForm from "@/src/components/access-key-form";
import { getAccessKeyById } from "@/src/core/actions/access-key";

export const metadata: Metadata = {
    title: createPageTitle("New Dynamic Access Key")
};

interface Props {
    params: {
        serverId: string;
        accessKeyId: string;
    };
}

export default async function AccessKeyCreatePage({ params }: Props) {
    const serverId = parseInt(params.serverId);

    const accessKey = await getAccessKeyById(serverId, parseInt(params.accessKeyId));

    return <AccessKeyForm accessKeyData={accessKey} serverId={serverId} />;
}
