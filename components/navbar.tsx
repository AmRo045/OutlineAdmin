"use client";

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
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";

import { ThemeSwitch } from "@/components/theme-switch";
import { DynamicAccessKeyIcon, GithubIcon, Logo, LogoutIcon, ServersIcon, XIcon } from "@/components/icons";
import { logout } from "@/core/actions";
import { UserSession } from "@/core/definitions";
import { app } from "@/core/config";

const navItems = [
    {
        label: "Servers",
        pathName: "/servers",
        icon: <ServersIcon size={24} />
    },
    {
        label: "Dynamic Access Keys",
        pathName: "/dynamic-access-keys",
        icon: <DynamicAccessKeyIcon size={24} />
    }
];

interface Props {
    session: UserSession;
}

export const Navbar = ({ session }: Props) => {
    const currentPathname = usePathname();
    const isAuthorized = session.isAuthorized;

    const logoutForm = useForm();

    const handleLogout = async () => {
        await logout();
    };

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
                            <NavbarItem key={item.pathName} isActive={currentPathname.startsWith(item.pathName)}>
                                <NextLink
                                    className={`flex gap-2 items-center ${currentPathname.startsWith(item.pathName) ? "text-primary-500" : null}`}
                                    href={item.pathName}
                                >
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
                    <Link isExternal aria-label="X (Twitter)" href={app.links.x}>
                        <XIcon className="text-default-500" />
                    </Link>

                    <Link isExternal aria-label="Github" href={app.links.github}>
                        <GithubIcon className="text-default-500" />
                    </Link>

                    <ThemeSwitch />
                </NavbarItem>

                {isAuthorized && (
                    <NavbarItem className="hidden md:flex">
                        <form onSubmit={logoutForm.handleSubmit(handleLogout)}>
                            <Button
                                color="danger"
                                isIconOnly={true}
                                isLoading={logoutForm.formState.isSubmitting}
                                size="sm"
                                type="submit"
                                variant="light"
                            >
                                <LogoutIcon size={22} />
                            </Button>
                        </form>
                    </NavbarItem>
                )}
            </NavbarContent>

            <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
                <Link isExternal aria-label="Github" href={app.links.github}>
                    <GithubIcon className="text-default-500" />
                </Link>

                <ThemeSwitch />

                {isAuthorized && <NavbarMenuToggle />}
            </NavbarContent>

            {isAuthorized && (
                <NavbarMenu>
                    <div className="mx-4 mt-2 flex flex-col gap-2">
                        {navItems.map((item) => (
                            <NavbarMenuItem key={item.pathName}>
                                <NextLink className="flex gap-2 items-center" href={item.pathName}>
                                    {item.icon}
                                    <span>{item.label.toUpperCase()}</span>
                                </NextLink>
                            </NavbarMenuItem>
                        ))}

                        <NavbarMenuItem key="logout">
                            <form onSubmit={logoutForm.handleSubmit(handleLogout)}>
                                <Button
                                    className="ps-0"
                                    color="danger"
                                    isLoading={logoutForm.formState.isSubmitting}
                                    type="submit"
                                    variant="light"
                                >
                                    <LogoutIcon size={22} />
                                    <span>LOGOUT</span>
                                </Button>
                            </form>
                        </NavbarMenuItem>
                    </div>
                </NavbarMenu>
            )}
        </NextUINavbar>
    );
};
