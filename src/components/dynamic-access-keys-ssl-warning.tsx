"use client";

import { useEffect, useState } from "react";
import { Alert } from "@heroui/react";

export default function DynamicAccessKeysSslWarning() {
    const [isHttp, setIsHttp] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.location?.protocol === "http:") {
            setIsHttp(true);
        }
    }, []);

    if (!isHttp) return null;

    return <Alert color="warning">A valid domain name with SSL encryption is required to use this feature.</Alert>;
}
