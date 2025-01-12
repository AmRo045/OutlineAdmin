"use client";

import { Link } from "@nextui-org/link";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";

import { app } from "@/src/core/config";
import { AmRoLogo, GithubIcon, HeartIcon, HeartIconDuotone, RedditIcon } from "@/src/components/icons";
import { ThemeSwitch } from "@/src/components/theme-switch";
import DonationModal from "@/src/components/modals/donation-modal";

export const Footer = () => {
    const donationModalDisclosure = useDisclosure();

    return (
        <footer className="w-full grid place-items-center gap-8 py-3 mt-8">
            <DonationModal disclosure={donationModalDisclosure} />

            <div className="flex gap-6 items-center justify-center">
                <Tooltip closeDelay={100} content="Donation">
                    <Link href="#" onPress={donationModalDisclosure.onOpen}>
                        <HeartIconDuotone className="text-default-500" size={24} />
                    </Link>
                </Tooltip>

                <Tooltip closeDelay={100} content="Github page">
                    <Link isExternal href={app.links.github}>
                        <GithubIcon className="text-default-500" size={24} />
                    </Link>
                </Tooltip>

                <Tooltip closeDelay={100} content="Reddit page">
                    <Link isExternal href={app.links.outlineVpnWiki.index}>
                        <RedditIcon className="text-default-500" size={24} />
                    </Link>
                </Tooltip>

                <ThemeSwitch />
            </div>

            <Button
                isExternal
                as={Link}
                className="flex items-center gap-1 text-current"
                href={app.links.me}
                size="sm"
                variant="light"
            >
                <span className="text-default-600">Made with</span>
                <HeartIcon className="fill-red-500" size={20} />
                <span className="text-default-600">by</span>
                <AmRoLogo className="fill-primary" size={24} />
                <span className="text-default-600">for FREE internet</span>
            </Button>
        </footer>
    );
};
