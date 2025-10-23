import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import NotificationChannelsList from "@/src/components/notification-channels-list";
import { getNotificationChannels } from "@/src/core/actions/notification-channel";

export const metadata: Metadata = {
    title: createPageTitle("Notification Channels")
};

export default async function NotificationChannelsPage() {
    const channels = await getNotificationChannels({});

    return <NotificationChannelsList data={channels} />;
}
