import { getDynamicAccessKeys } from "@/src/core/actions/dynamic-access-key";
import { DynamicAccessKeyWithAccessKeysCount } from "@/src/core/definitions";
import DynamicAccessKeysList from "@/src/components/dynamic-access-keys-list";

export default async function DynamicAccessKeysPage() {
    const dynamicAccessKeys: DynamicAccessKeyWithAccessKeysCount[] = await getDynamicAccessKeys({}, true);

    return <DynamicAccessKeysList data={dynamicAccessKeys} />;
}
