import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import NotificationChannelForm from "@/src/components/notification-channel-form";

export const metadata: Metadata = {
    title: createPageTitle("New Notification Channel")
};

export default async function NotificationChannelEditPage() {
    return <NotificationChannelForm />;
}
