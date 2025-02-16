import { Metadata } from "next";

import DynamicAccessKeysList from "@/src/components/dynamic-access-keys-list";
import { createPageTitle } from "@/src/core/utils";

export const metadata: Metadata = {
    title: createPageTitle("Dynamic Access Keys")
};

export default async function DynamicAccessKeysPage() {
    return <DynamicAccessKeysList />;
}
