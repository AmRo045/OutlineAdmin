"use client";

import { UseDisclosureReturn } from "@heroui/use-disclosure";
import {
    Accordion,
    AccordionItem,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Snippet
} from "@heroui/react";
import React, { useEffect, useRef } from "react";

import { CopyIcon } from "@/src/components/icons";
import { app } from "@/src/core/config";
import useQrCode from "@/src/hooks/use-qr-code";

interface Props {
    disclosure: UseDisclosureReturn;
}

export default function DonationModal({ disclosure }: Props) {
    return (
        <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
            <ModalContent>
                <ModalHeader>💗 Donation</ModalHeader>
                <ModalBody>
                    <div>
                        If you find this project useful and would like to support its development, you can make a
                        donation.
                    </div>

                    <Accordion variant="light">
                        {Object.entries(app.donation).map(([name, address]) => (
                            <AccordionItem key={name} aria-label={name} title={name}>
                                <CryptoItem address={address} name={name} />
                            </AccordionItem>
                        ))}
                    </Accordion>
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

function CryptoItem({ name, address }: { name: string; address: string }) {
    const qrCodeContainerRef = useRef<HTMLDivElement>(null);

    const qrCode = useQrCode(qrCodeContainerRef);

    useEffect(() => {
        qrCode(address);
    }, []);

    return (
        <div className="grid place-items-center overflow-hidden">
            <div className="flex justify-center mb-4">
                <div ref={qrCodeContainerRef} className="rounded-xl overflow-hidden bg-default-100" />
            </div>
            <Snippet
                classNames={{
                    base: "!max-w-[360px]",
                    copyButton: "text-sm !min-w-6 !w-6 h-6",
                    pre: "!ps-1 truncate"
                }}
                copyIcon={<CopyIcon size={16} />}
                symbol={<span className="text-foreground-500 me-2">{name}:</span>}
            >
                {address}
            </Snippet>
        </div>
    );
}
