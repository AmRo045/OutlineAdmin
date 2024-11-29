import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { DynamicAccessKeyIcon, GithubIcon, Logo, LogoutIcon, ServersIcon, XIcon } from "@/components/icons";

const navItems = [
    {
        label: "Servers",
        href: "/servers",
        icon: <ServersIcon size={22} />
    },
    {
        label: "Dynamic Access Keys",
        href: "/dynamic-access-keys",
        icon: <DynamicAccessKeyIcon size={22} />
    }
];

export const Navbar = () => {
    const isAuthorized = true;

    return (
        <NextUINavbar maxWidth="xl" position="sticky">
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink className="flex justify-start items-center gap-1" href="/">
                        <Logo size={32} />
                        <p className="font-bold text-inherit">{process.env.APP_NAME?.toUpperCase()}</p>
                    </NextLink>
                </NavbarBrand>
                {isAuthorized && (
                    <ul className="hidden lg:flex gap-4 justify-start ml-2">
                        {navItems.map((item) => (
                            <NavbarItem key={item.href}>
                                <NextLink className="flex gap-2 items-center" href={item.href}>
                                    {item.icon}
                                    <span>{item.label.toUpperCase()}</span>
                                </NextLink>
                            </NavbarItem>
                        ))}
                    </ul>
                )}
            </NavbarContent>

            <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
                <NavbarItem className="hidden sm:flex gap-2">
                    <Link isExternal aria-label="Twitter" href={siteConfig.links.x}>
                        <XIcon className="text-default-500" />
                    </Link>

                    <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                        <GithubIcon className="text-default-500" />
                    </Link>

                    <ThemeSwitch />
                </NavbarItem>

                {isAuthorized && (
                    <NavbarItem className="hidden md:flex">
                        <Button className="text-sm" color="danger" variant="light">
                            Logout
                        </Button>
                    </NavbarItem>
                )}
            </NavbarContent>

            <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
                <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                    <GithubIcon className="text-default-500" />
                </Link>

                <ThemeSwitch />

                {isAuthorized && <NavbarMenuToggle />}
            </NavbarContent>

            {isAuthorized && (
                <NavbarMenu>
                    <div className="mx-4 mt-2 flex flex-col gap-2">
                        {navItems.map((item) => (
                            <NavbarMenuItem key={item.href}>
                                <NextLink className="flex gap-2 items-center" href={item.href}>
                                    {item.icon}
                                    <span>{item.label.toUpperCase()}</span>
                                </NextLink>
                            </NavbarMenuItem>
                        ))}

                        <NavbarMenuItem key="logout">
                            <NextLink className="flex gap-2 items-center" href="#">
                                <LogoutIcon size={22} />
                                <span>LOGOUT</span>
                            </NextLink>
                        </NavbarMenuItem>
                    </div>
                </NavbarMenu>
            )}
        </NextUINavbar>
    );
};
