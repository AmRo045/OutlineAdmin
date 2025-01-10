import React from "react";
import { Metadata } from "next";

import { createPageTitle } from "@/src/core/utils";
import ServerAddForm from "@/src/components/server-add-form";

export const metadata: Metadata = {
    title: createPageTitle("Add Server")
};

export default function AddServerPage() {
    return <ServerAddForm />;
}
