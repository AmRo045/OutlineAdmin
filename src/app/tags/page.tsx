import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import { getTags } from "@/src/core/actions/tags";
import TagsList from "@/src/components/tags-list";

export const metadata: Metadata = {
    title: createPageTitle("Tags")
};

export default async function TagsPage() {
    const tags = await getTags({});

    return <TagsList data={tags} />;
}
