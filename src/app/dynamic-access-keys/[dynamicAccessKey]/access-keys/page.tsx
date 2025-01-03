import { notFound } from "next/navigation";

import { getDynamicAccessKeyById } from "@/src/core/actions/dynamic-access-key";
import DynamicAccessKeyAccessKeysForm from "@/src/components/dynamic-access-key-access-keys-form";
import { getServersWithAccessKeys } from "@/src/core/actions/server";

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
