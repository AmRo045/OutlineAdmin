import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet } from "@nextui-org/react";
import React, { useEffect, useRef } from "react";

import { CopyIcon } from "@/components/icons";
import useQrCode from "@/hooks/use-qr-code";

interface Props {
    disclosure: UseDisclosureReturn;
    value: string | undefined;
}

export default function DynamicAccessKeyModal({ disclosure, value }: Props) {
    const qrCodeContainerRef = useRef<HTMLDivElement>(null);

    const qrCode = useQrCode(qrCodeContainerRef);

    useEffect(() => {
        if (disclosure.isOpen) {
            qrCode(value);
        }
    }, [disclosure.isOpen]);

    return (
        <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
            <ModalContent>
                <ModalHeader>🗝️ Dynamic Access Key</ModalHeader>
                <ModalBody>
                    <div className="flex justify-center mb-4">
                        <div ref={qrCodeContainerRef} className="rounded-xl overflow-hidden bg-default-100" />
                    </div>

                    <Snippet
                        classNames={{
                            base: "!max-w-[280px] md:!max-w-[700px]",
                            copyButton: "text-sm !min-w-6 !w-6 h-6",
                            pre: "!ps-1 truncate"
                        }}
                        copyIcon={<CopyIcon size={16} />}
                        hideSymbol={true}
                        variant="flat"
                    >
                        {value}
                    </Snippet>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={disclosure.onClose}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
