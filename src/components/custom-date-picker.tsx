import { parseDate } from "@internationalized/date";
import { Button, CalendarDate, DatePicker } from "@nextui-org/react";
import React, { useRef } from "react";
import { CalendarBoldIcon } from "@nextui-org/shared-icons";

import { getCurrentDateAsString } from "@/src/core/utils";

interface Props {
    value?: string;
    label?: string;
    onChange?: (value?: string) => void;
}

export default function CustomDatePicker({ label, value, onChange }: Props) {
    const triggerRef = useRef<any>();

    const openCalendar = () => {
        if (triggerRef.current) {
            triggerRef.current.click();
        }
    };

    const handleSelection = (v: CalendarDate | null) => {
        if (!onChange) return;

        if (v) {
            const month = ("0" + v.month).slice(-2);
            const day = ("0" + v.day).slice(-2);

            const formattedDate = `${v.year}-${month}-${day}`;

            onChange(formattedDate);
        } else {
            onChange(undefined);
        }
    };

    return (
        <div className="grid w-full">
            <DatePicker
                className="col-start-1 row-start-1 opacity-0"
                minValue={parseDate(getCurrentDateAsString())}
                radius="sm"
                selectorButtonProps={{
                    ref: triggerRef
                }}
                size="lg"
                value={value ? parseDate(value) : undefined}
                variant="faded"
                onChange={handleSelection}
            />

            <Button
                className="text-sm col-start-1 row-start-1"
                fullWidth={true}
                radius="sm"
                size="lg"
                startContent={<CalendarBoldIcon height={18} width={18} />}
                variant="faded"
                onPress={openCalendar}
            >
                {label && <span className="text-default-500">{label}</span>}
                {value && <span className="text-foreground">{value}</span>}
                {!value && <span className="text-default-500">YYYY-MM-DD</span>}
            </Button>
        </div>
    );
}
