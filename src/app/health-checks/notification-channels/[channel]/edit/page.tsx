import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageTitle } from "@/src/core/utils";
import NotificationChannelForm from "@/src/components/notification-channel-form";
import { getNotificationChannelById } from "@/src/core/actions/notification-channel";

export const metadata: Metadata = {
    title: createPageTitle("Notification Channel Form")
};

interface Props {
    params: {
        channel: string;
    };
}

export default async function NotificationChannelEditPage({ params }: Props) {
    const channel = await getNotificationChannelById(parseInt(params.channel));

    if (!channel) {
        notFound();
    }

    return <NotificationChannelForm channel={channel} />;
}
