import { getDynamicAccessKeys } from "@/core/actions/dynamic-access-key";
import { DynamicAccessKeyWithAccessKeysCount } from "@/core/definitions";
import DynamicAccessKeysList from "@/components/dynamic-access-keys-list";

export default async function DynamicAccessKeysPage() {
    const dynamicAccessKeys: DynamicAccessKeyWithAccessKeysCount[] = await getDynamicAccessKeys({}, true);

    return <DynamicAccessKeysList data={dynamicAccessKeys} />;
}
