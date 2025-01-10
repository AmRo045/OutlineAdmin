"use client";

import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet } from "@nextui-org/react";
import React from "react";

import { CopyIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";

interface Props {
    disclosure: UseDisclosureReturn;
}

export default function DonationModal({ disclosure }: Props) {
    return (
        <Modal isOpen={disclosure.isOpen} size="lg" onOpenChange={disclosure.onOpenChange}>
            <ModalContent>
                <ModalHeader>💗 Donation</ModalHeader>
                <ModalBody>
                    <div>
                        If you find this project useful and would like to support its development, you can make a
                        donation.
                    </div>

                    <div>
                        <Snippet
                            classNames={{
                                base: "!max-w-[400px]",
                                copyButton: "text-sm !min-w-6 !w-6 h-6",
                                pre: "!ps-1 truncate"
                            }}
                            copyIcon={<CopyIcon size={16} />}
                            symbol={<span className="text-foreground-500 me-2">TON:</span>}
                        >
                            {app.donation.ton}
                        </Snippet>
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-end">
                    <Button variant="flat" onPress={disclosure.onClose}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
