import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageTitle } from "@/src/core/utils";
import { getHealthCheckById } from "@/src/core/actions/health-check";
import HealthCheckEditForm from "@/src/components/health-check-edit-form";

interface Props {
    params: {
        healthCheck: string;
    };
}

export const metadata: Metadata = {
    title: createPageTitle("Health Check Details")
};

export default async function HealthCheckEditPage({ params }: Props) {
    const healthCheck = await getHealthCheckById(parseInt(params.healthCheck));

    if (!healthCheck) {
        notFound();
    }

    return <HealthCheckEditForm healthCheck={healthCheck} />;
}
