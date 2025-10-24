import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageTitle } from "@/src/core/utils";
import { getHealthCheckById } from "@/src/core/actions/health-check";
import HealthCheckEditForm from "@/src/components/health-check-edit-form";
import { getNotificationChannels } from "@/src/core/actions/notification-channel";

interface Props {
    params: {
        healthCheckId: string;
    };
}

export const metadata: Metadata = {
    title: createPageTitle("Health Check Details")
};

export default async function HealthCheckEditPage({ params }: Props) {
    const healthCheck = await getHealthCheckById(parseInt(params.healthCheckId));

    if (!healthCheck) {
        notFound();
    }

    const notificationChannels = await getNotificationChannels({ take: 100000 });

    return <HealthCheckEditForm healthCheck={healthCheck} notificationChannels={notificationChannels} />;
}
