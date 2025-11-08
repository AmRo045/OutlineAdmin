import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import DynamicAccessKeyForm from "@/src/components/dynamic-access-key-form";
import { findDynamicAccessKeyById } from "@/src/core/actions/dynamic-access-key";
import { getServers } from "@/src/core/actions/server";
import { getTags } from "@/src/core/actions/tags";

export const metadata: Metadata = {
    title: createPageTitle("Edit Dynamic Access Key")
};

interface Props {
    params: {
        dynamicAccessKeyId: string;
    };
}

export default async function DynamicAccessKeyEditPage({ params }: Props) {
    const dynamicAccessKey = await findDynamicAccessKeyById(parseInt(params.dynamicAccessKeyId));
    const servers = await getServers({ status: true });
    const tags = await getTags();

    return <DynamicAccessKeyForm dynamicAccessKey={dynamicAccessKey} servers={servers} tags={tags} />;
}
