import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import DynamicAccessKeyForm from "@/src/components/dynamic-access-key-form";
import { getServers } from "@/src/core/actions/server";
import { getTags } from "@/src/core/actions/tags";

export const metadata: Metadata = {
    title: createPageTitle("New Dynamic Access Key")
};

export default async function DynamicAccessKeyCreatePage() {
    const servers = await getServers({ status: true });
    const tags = await getTags();

    return <DynamicAccessKeyForm servers={servers} tags={tags} />;
}
