import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageTitle } from "@/src/core/utils";
import AccessKeyForm from "@/src/components/access-key-form";
import { getAccessKeyById } from "@/src/core/actions/access-key";

export const metadata: Metadata = {
    title: createPageTitle("Edit Access Key")
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

    if (!accessKey) {
        notFound();
    }

    return <AccessKeyForm accessKeyData={accessKey} serverId={serverId} />;
}
