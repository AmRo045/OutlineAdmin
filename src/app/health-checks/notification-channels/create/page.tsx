import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import NotificationChannelForm from "@/src/components/notification-channel-form";

export const metadata: Metadata = {
    title: createPageTitle("Notification Channel Form")
};

export default async function HealthCheckEditPage() {
    return <NotificationChannelForm />;
}
