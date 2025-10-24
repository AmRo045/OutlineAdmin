import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import AccessKeyForm from "@/src/components/access-key-form";

export const metadata: Metadata = {
    title: createPageTitle("New Dynamic Access Key")
};

interface Props {
    params: {
        serverId: string;
    };
}

export default async function AccessKeyCreatePage({ params }: Props) {
    return <AccessKeyForm serverId={parseInt(params.serverId)} />;
}
