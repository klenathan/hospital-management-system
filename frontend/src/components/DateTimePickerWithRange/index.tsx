
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePickerDemo } from "../TimePicker/time-picker-demo";

interface DateTimePickerWithRangeProps {
    className?: string;
    selected: DateRange | undefined;
    onSubmit: (date: DateRange | undefined) => void;
}

export function DateTimePickerWithRange({
    className,
    selected,
    onSubmit,
}: DateTimePickerWithRangeProps) {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(selected);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const handleSelectDate = (range: DateRange | undefined) => {
        if (!range) {
            setDateRange(undefined);
            return;
        }

        const updatedFrom = range.from ? new Date(range.from) : undefined;
        const updatedTo = range.to ? new Date(range.to) : undefined;

        setDateRange({ from: updatedFrom, to: updatedTo });
    };

    const handleSubmit = () => {
        onSubmit(dateRange);
        setIsOpen(false);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen}>
                <PopoverTrigger asChild >
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                        )}
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        <CalendarIcon className="mr-2 w-4 h-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleSelectDate}
                        numberOfMonths={2}
                    />
                    <div className="flex justify-between items-center p-3 border-t border-border">
                        <TimePickerDemo date={dateRange?.from} setDate={(date) => handleSelectDate({ from: date, to: dateRange?.to })} />
                        <TimePickerDemo date={dateRange?.to} setDate={(date) => handleSelectDate({ from: dateRange?.from, to: date })} />
                    </div>
                    <div className="flex justify-end p-3 border-t border-border">
                        <Button onClick={handleSubmit}>Add Time</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
