import { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";

interface Props {
    disclosure: UseDisclosureReturn;
    type: 0 | 1;
}

export default function AccessKeyFormModal({ disclosure, type }: Props) {
    const [selectedDataLimitUnit, setSelectedDataLimitUnit] = useState<string>("Bytes");

    return (
        <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
            <ModalContent>
                <ModalHeader>{type === 1 ? `Access Key #${2}` : "New Access Key"}</ModalHeader>
                <ModalBody>
                    <form className="grid gap-4" id="accessKeyForm">
                        <Input isRequired={true} label="Access key name" size="sm" variant="faded" />

                        <div className="flex gap-2">
                            <Input label="Data limit" size="sm" type="number" variant="faded" />

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="bg-default-100 text-sm"
                                        radius="sm"
                                        size="lg"
                                        type="button"
                                        variant="ghost"
                                    >
                                        {selectedDataLimitUnit}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    defaultSelectedKeys={new Set([selectedDataLimitUnit])}
                                    selectionMode="single"
                                    variant="flat"
                                    onSelectionChange={(v) => setSelectedDataLimitUnit(v.currentKey!)}
                                >
                                    <DropdownItem key="Bytes">Bytes</DropdownItem>
                                    <DropdownItem key="KB">KB</DropdownItem>
                                    <DropdownItem key="MB">MB</DropdownItem>
                                    <DropdownItem key="GB">GB</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <DatePicker
                            showMonthAndYearPickers
                            hideTimeZone={true}
                            label="Expiration date"
                            size="sm"
                            variant="faded"
                        />
                    </form>
                </ModalBody>
                <ModalFooter className="flex justify-between gap-2 mt-4">
                    <Button variant="flat" onClick={disclosure.onClose}>
                        Cancel
                    </Button>

                    <Button color="primary" form="accessKeyForm" type="submit" variant="shadow">
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
