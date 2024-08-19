"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
    className?: string;
    selected: DateRange | undefined;
    onSubmit: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
    className,
    selected,
    onSubmit,
}: DatePickerWithRangeProps) {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(selected);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const handleSelectDate = (range: DateRange | undefined) => {
        setDateRange(range);
    };

    const handleSubmit = () => {
        onSubmit(dateRange);
        setIsOpen(false);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen}>
                <PopoverTrigger asChild>
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
                        numberOfMonths={1}
                    />
                    <div className="flex justify-end p-3 border-t border-border">
                        <Button onClick={handleSubmit}>Apply</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
