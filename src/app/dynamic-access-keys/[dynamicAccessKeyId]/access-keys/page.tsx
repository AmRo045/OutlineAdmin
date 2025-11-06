import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getDynamicAccessKeyById } from "@/src/core/actions/dynamic-access-key";
import DynamicAccessKeyAccessKeysForm from "@/src/components/dynamic-access-key-access-keys-form";
import { getServersWithAccessKeysAndTags } from "@/src/core/actions/server";
import { createPageTitle } from "@/src/core/utils";

interface Props {
    params: {
        dynamicAccessKeyId: string;
    };
}

export const metadata: Metadata = {
    title: createPageTitle("Access Keys -> Dynamic Access Key")
};

export default async function DynamicAccessKeyAccessKeysFormPage({ params }: Props) {
    const dynamicAccessKey = await getDynamicAccessKeyById(parseInt(params.dynamicAccessKeyId), true);

    if (!dynamicAccessKey) {
        notFound();
    }

    const servers = await getServersWithAccessKeysAndTags();

    return <DynamicAccessKeyAccessKeysForm dynamicAccessKey={dynamicAccessKey} servers={servers} />;
}
