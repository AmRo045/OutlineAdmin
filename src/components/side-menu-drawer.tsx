"use client";

import React from "react";
import { Button, Drawer, DrawerBody, DrawerContent, useDisclosure } from "@heroui/react";
import NextLink from "next/link";

import { HamburgerMenuIcon, Logo } from "@/src/components/icons";
import { SideMenu } from "@/src/components/side-menu";
import { app } from "@/src/core/config";

export const SideMenuDrawer = () => {
    const disclosure = useDisclosure();

    return (
        <>
            <div className="xl:hidden flex justify-between items-center fixed z-20 w-full backdrop-blur p-2">
                <NextLink className="w-fit items-center flex justify-start gap-2" href="/">
                    <Logo size={24} />
                    <span className="font-bold text-inherit mt-1.5">{app.name.toUpperCase()} </span>
                </NextLink>

                <Button isIconOnly={true} radius="sm" variant="light" onPress={disclosure.onOpen}>
                    <HamburgerMenuIcon size={24} />
                </Button>
            </div>

            <Drawer
                isOpen={disclosure.isOpen}
                placement="left"
                radius="none"
                size="xs"
                onOpenChange={disclosure.onOpenChange}
            >
                <DrawerContent>
                    <DrawerBody className="p-0">
                        <SideMenu drawerDisclosure={disclosure} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
