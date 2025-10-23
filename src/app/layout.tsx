import "@/src/styles/globals.css";

import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";

import { Providers } from "./providers";

import { currentSession } from "@/src/core/session";
import { app } from "@/src/core/config";
import { createPageTitle } from "@/src/core/utils";
import { Footer } from "@/src/components/footer";
import { SideMenu } from "@/src/components/side-menu";
import { SideMenuDrawer } from "@/src/components/side-menu-drawer";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" }
    ]
};

export const metadata: Metadata = {
    title: createPageTitle(),
    description: app.description
};

interface Props {
    children: ReactNode;
}

export default async function RootLayout({ children }: Props) {
    const session = await currentSession();

    // noinspection HtmlRequiredTitleElement
    return (
        <html suppressHydrationWarning lang="en">
            <head>
                <link href="/favicon.svg" rel="icon" sizes="any" type="image/svg+xml" />
            </head>

            <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
                    {session.isAuthorized ? (
                        <div className="grid xl:grid-cols-[auto_1fr] gap-2">
                            <div className="hidden xl:block">
                                <SideMenu />
                            </div>

                            <div className="relative flex flex-col w-full h-screen">
                                <SideMenuDrawer />

                                <main className="w-full pt-8 px-6 flex-grow">{children}</main>

                                <Footer />
                            </div>
                        </div>
                    ) : (
                        <div className="relative flex flex-col w-full h-screen">
                            <main className="w-full flex-grow">{children}</main>

                            <Footer />
                        </div>
                    )}
                </Providers>
            </body>
        </html>
    );
}
