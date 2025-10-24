import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import DynamicAccessKeyForm from "@/src/components/dynamic-access-key-form";

export const metadata: Metadata = {
    title: createPageTitle("New Dynamic Access Key")
};

export default async function DynamicAccessKeyCreatePage() {
    return <DynamicAccessKeyForm />;
}
