import "@/styles/globals.css";
import { Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { ReactNode } from "react";

import { Providers } from "./providers";

import { Navbar } from "@/components/navbar";
import { AmRoLogo, HeartIcon } from "@/components/icons";
import { currentSession } from "@/core/session";
import { app } from "@/core/config";

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" }
    ]
};

interface Props {
    children: ReactNode;
}

export default async function RootLayout({ children }: Props) {
    const session = await currentSession();

    return (
        <html suppressHydrationWarning lang="en">
            <head>
                <title>{process.env.APP_NAME}</title>
                <meta
                    content="Outline Admin is a web interface for the Outline Manager API, providing a simple and user-friendly UI for managing VPN servers."
                    name="description"
                />
                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                <link href="/favicon.svg" rel="icon" sizes="any" type="image/svg+xml" />
            </head>

            <body className={clsx("min-h-screen bg-background font-sans antialiased", app.fonts.fontSans.variable)}>
                <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                    <div className="relative flex flex-col h-screen">
                        <Navbar session={session} />

                        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">{children}</main>

                        <footer className="w-full flex items-center justify-center py-3">
                            <Link
                                isExternal
                                className="flex items-center gap-1 text-current"
                                href={app.links.me}
                                title="AmRo045 Page"
                            >
                                <span className="text-default-600">Made with</span>
                                <HeartIcon className="fill-red-500" size={20} />
                                <span className="text-default-600">by</span>
                                <AmRoLogo className="fill-primary" size={24} />
                                <span className="text-default-600">for FREE internet</span>
                            </Link>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
