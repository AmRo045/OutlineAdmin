import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import DynamicAccessKeyStatsForm from "@/src/components/dynamic-access-key-stats-form";

export const metadata: Metadata = {
    title: createPageTitle("Dynamic Access Key Stats")
};

export default async function DynamicAccessKeyStatsPage() {
    return <DynamicAccessKeyStatsForm />;
}
