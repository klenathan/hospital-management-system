import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { PatientResponse } from '@/types/patients';
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import { PatientTreatmentResponse } from '@/types/report';
import { format } from "date-fns";
import TableEmpty from '@/components/TableEmpty';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function PatientTreatmentTab() {
    const [selectedPatient, setSelectedPatient] = useState<{ value: string; label: string } | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(),
    });
    const [open, setOpen] = useState(false);
    const [patientsOptions, setPatientsOptions] = useState<{ value: string; label: string }[]>([]);

    const getApiEndpoint = (inputValue: string) => {
        return inputValue != '' ? `/api/patient/name/${inputValue}` : `/api/patient/?order=asc&pageSize=20&pageNumber=1`;
    };

    const { data: patientsData, isLoading: patientsLoading } = useQueryWithTokenAPI<PatientResponse>(
        ['patient', inputValue],
        getApiEndpoint(inputValue)
    );

    // Update patientsOptions when patientsData changes
    useEffect(() => {
        if (!patientsLoading && patientsData) {
            const filteredPatientList = patientsData.data.map((patient) => ({
                value: patient.id.toString(),
                label: `${patient.first_name} ${patient.last_name}`,
            }));
            setPatientsOptions(filteredPatientList);
        }
    }, [inputValue, patientsData, patientsLoading]);



    const handlePatientSelect = (patientId: string | null, patientName: string | '') => {
        setInputValue(patientName);
        const selected = patientsOptions.find((patient) => patient.value === patientId);
        setSelectedPatient(selected || null);
        setOpen(false); // Close the combobox
    };


    const getFormattedDate = (date?: Date) => (date ? format(date, "yyyy-MM-dd HH:mm:ss") : '');
    const queryStartTime = getFormattedDate(dateRange?.from);
    const queryEndTime = getFormattedDate(dateRange?.to);
    const patientID = selectedPatient?.value || '';

    const { data: patientTreatmentData, isLoading: patientTreatmentDataLoading, isError, refetch } = useQueryWithTokenAPI<PatientTreatmentResponse>(
        ['patientTreatment', patientID, queryStartTime, queryEndTime],
        patientID
            ? `/api/report/patientTreatmentHistory?patientId=${encodeURIComponent(patientID)}&startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
            : `/api/report/patientTreatmentHistory?startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
    );


    useEffect(() => {
        if (inputValue === '') {
            setSelectedPatient(null)
            console.log(patientTreatmentData);
            refetch();
        }
    }, [inputValue, patientTreatmentData, refetch]);

    return (
        <div className="space-y-4">
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                    <Label className=''>Patient</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="justify-between w-full"
                            >
                                {selectedPatient?.label || "Select a patient..."}
                                <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[200px]">
                            <Command>
                                <CommandInput
                                    placeholder="Search patient..."
                                    value={inputValue}
                                    onValueChange={(value) => setInputValue(value)} // Corrected event handler
                                />
                                <CommandList>
                                    {patientsOptions.length > 0 ? (<>
                                        <div
                                            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground p-1 text-foreground overflow-hidden">
                                            {patientsOptions.map((patient) => (
                                                <div
                                                    className="relative flex items-center data-[selected=true]:bg-accent hover:bg-gray-100 data-[disabled=true]:opacity-50 px-2 py-1.5 rounded-sm text-sm data-[selected=true]:text-accent-foreground cursor-default cursor-pointer data-[disabled=true]:pointer-events-none select-none outline-none"
                                                    key={patient.value}
                                                    // value={patient.value}
                                                    onClick={() => handlePatientSelect(patient.value, patient.label)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedPatient?.value === patient.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {patient.label}
                                                </div>
                                            ))}
                                        </div>
                                    </>) :
                                        <CommandEmpty>No patient found.</CommandEmpty>

                                    }


                                    {/* <CommandGroup>
                                        {patientsOptions.length > 0 ? (
                                            patientsOptions.map((patient) => (
                                                <CommandItem
                                                    key={patient.value}
                                                    value={patient.value}
                                                    onSelect={() => handlePatientSelect(patient.value)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedPatient?.value === patient.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {patient.label}
                                                </CommandItem>
                                            ))
                                        ) : (
                                            <CommandEmpty>No patients found.</CommandEmpty>
                                        )}
                                    </CommandGroup> */}
                                </CommandList>
                            </Command>

                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-2">
                    <Label className=''>Date Range</Label>
                    <DatePickerWithRange
                        className="w-full"
                        selected={dateRange}
                        onSubmit={(range) => setDateRange(range)}
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Staff Job Type</TableHead>
                        <TableHead>Treatment Date</TableHead>
                        <TableHead>Treatment Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patientTreatmentDataLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : patientTreatmentData?.queryResult.count === 0 || isError ? (
                        <TableEmpty colSpan={5} />
                    ) : (
                        patientTreatmentData?.data.map((treatment, index) => (
                            <TableRow key={index}>
                                <TableCell>{`${treatment.patient_first_name} ${treatment.patient_last_name}`}</TableCell>
                                <TableCell>{`${treatment.staff_first_name} ${treatment.staff_last_name}`}</TableCell>
                                <TableCell>{treatment.staff_job_type}</TableCell>
                                <TableCell>{format(new Date(treatment.treatment_date), "PPP")}</TableCell>
                                <TableCell>{treatment.treatment_details}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
