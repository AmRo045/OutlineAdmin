"use client";

import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { ReactNode } from "react";

interface Props {
    disclosure: UseDisclosureReturn;
    title?: string | ReactNode;
    body?: string | ReactNode;
    isDismissable?: boolean;
}

export default function MessageModal({ disclosure, title, body, isDismissable = false }: Props) {
    return (
        <Modal
            hideCloseButton={!isDismissable}
            isDismissable={isDismissable}
            isKeyboardDismissDisabled={!isDismissable}
            isOpen={disclosure.isOpen}
            scrollBehavior="inside"
            onOpenChange={disclosure.onOpenChange}
        >
            <ModalContent>
                {title && <ModalHeader>{title}</ModalHeader>}
                {body && <ModalBody>{body}</ModalBody>}
                <ModalFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="flat" onClick={disclosure.onClose}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
