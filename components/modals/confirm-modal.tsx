import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ReactNode, useState } from "react";
import { Button } from "@nextui-org/button";

interface Props {
    disclosure: UseDisclosureReturn;
    title?: string | ReactNode;
    body?: string | ReactNode;
    confirmLabel?: string;
    isDismissable?: boolean;
    onConfirm?: CallableFunction;
}

export default function ConfirmModal({
    disclosure,
    title,
    body,
    isDismissable = false,
    confirmLabel,
    onConfirm = () => {}
}: Props) {
    const [isPerformingIntendedAction, setIsPerformingIntendedAction] = useState<boolean>(false);

    return (
        <Modal
            hideCloseButton={!isDismissable}
            isDismissable={isDismissable}
            isKeyboardDismissDisabled={!isDismissable}
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onOpenChange}
        >
            <ModalContent>
                {title && <ModalHeader>{title}</ModalHeader>}
                {body && <ModalBody>{body}</ModalBody>}
                <ModalFooter className="flex justify-between gap-2 mt-4">
                    <Button
                        color="danger"
                        isLoading={isPerformingIntendedAction}
                        variant="shadow"
                        onClick={async () => {
                            setIsPerformingIntendedAction((prev) => !prev);
                            await onConfirm();
                            setIsPerformingIntendedAction((prev) => !prev);
                            disclosure.onClose();
                        }}
                    >
                        {confirmLabel ?? "Ok"}
                    </Button>
                    <Button isDisabled={isPerformingIntendedAction} variant="light" onClick={disclosure.onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
