"use client";

import React from "react";
import { Button, Drawer, DrawerBody, DrawerContent, useDisclosure } from "@heroui/react";

import { HamburgerMenuIcon } from "@/src/components/icons";
import { SideMenu } from "@/src/components/side-menu";
import { app } from "@/src/core/config";

export const SideMenuDrawer = () => {
    const disclosure = useDisclosure();

    return (
        <>
            <div className="xl:hidden block">
                <Button className="rounded-r-xl" radius="none" variant="light" onPress={disclosure.onOpen}>
                    <HamburgerMenuIcon size={24} />
                    {app.name.toUpperCase()}
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
