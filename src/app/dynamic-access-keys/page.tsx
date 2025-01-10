import { Metadata } from "next";

import { getDynamicAccessKeys } from "@/src/core/actions/dynamic-access-key";
import { DynamicAccessKeyWithAccessKeysCount } from "@/src/core/definitions";
import DynamicAccessKeysList from "@/src/components/dynamic-access-keys-list";
import { createPageTitle } from "@/src/core/utils";

export const metadata: Metadata = {
    title: createPageTitle("Dynamic Access Keys")
};

export default async function DynamicAccessKeysPage() {
    const dynamicAccessKeys: DynamicAccessKeyWithAccessKeysCount[] = await getDynamicAccessKeys({}, true);

    return <DynamicAccessKeysList data={dynamicAccessKeys} />;
}
