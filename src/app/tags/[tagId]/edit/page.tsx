import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageTitle } from "@/src/core/utils";
import TagForm from "@/src/components/tag-form";
import { getTagById } from "@/src/core/actions/tags";

export const metadata: Metadata = {
    title: createPageTitle("Edit Tag")
};

interface Props {
    params: {
        tagId: string;
    };
}

export default async function TagEditPage({ params }: Props) {
    const tag = await getTagById(parseInt(params.tagId));

    if (!tag) {
        notFound();
    }

    return <TagForm tag={tag} />;
}
