import { notFound } from "next/navigation";

import { getDynamicAccessKeyById } from "@/core/actions/dynamic-access-key";
import DynamicAccessKeyAccessKeysForm from "@/components/dynamic-access-key-access-keys-form";
import { getServersWithAccessKeys } from "@/core/actions/server";

interface Props {
    params: {
        dynamicAccessKey: string;
    };
}

export default async function DynamicAccessKeyAccessKeysFormPage({ params }: Props) {
    const dynamicAccessKey = await getDynamicAccessKeyById(parseInt(params.dynamicAccessKey), true);

    if (!dynamicAccessKey) {
        notFound();
    }

    const servers = await getServersWithAccessKeys();

    return <DynamicAccessKeyAccessKeysForm dynamicAccessKey={dynamicAccessKey} servers={servers} />;
}
