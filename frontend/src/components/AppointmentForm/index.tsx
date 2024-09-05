import AsyncSelect from 'react-select/async';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import { StaffListResponse } from '@/types/staffs';
import { PatientResponse } from '@/types/patients';
import { useMutationWithTokenAPI } from '@/hooks/API/useMutationAPI';
import { useToast } from '@/components/ui/use-toast';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function AppointmentForm() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [selectedDoctor, setSelectedDoctor] = useState<{ value: string; label: string } | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<{ value: string; label: string } | null>(null);

    const appointmentSchema = z.object({
        doctor: z.number().int().positive("Please select a valid doctor."),
        patient: z.number().int().positive("Please select a valid patient."),
        date: z.string().min(1, "Please select a date."),
        startTime: z.string().min(1, "Please select a start time."),
        endTime: z.string().min(1, "Please select an end time."),
        purpose: z.string().min(1, "Please enter the purpose of the appointment."),
    }).refine((data) => {
        const start = new Date(`${data.date}T${data.startTime}`);
        const end = new Date(`${data.date}T${data.endTime}`);
        return end > start;
    }, {
        message: "End time must be later than start time.",
        path: ["endTime"],
    });


    type AppointmentFormValues = z.infer<typeof appointmentSchema>;

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            doctor: 0,
            patient: 0,
            date: '',
            startTime: '',
            endTime: '',
            purpose: '',
        }
    });

    const { data: doctorsListData, isLoading: doctorsLoading } =
        useQueryWithTokenAPI<StaffListResponse>(
            ['doctor'],
            '/api/staff/doctors/'
        );

    const loadDoctorOptions = (inputValue: string, callback: (options: { value: string, label: string }[]) => void) => {
        if (doctorsLoading || !doctorsListData) return;

        const filteredDoctors = doctorsListData.data
            .filter(doctor =>
                `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 20)
            .map(doctor => ({
                value: doctor.id.toString(),
                label: `${doctor.first_name} ${doctor.last_name}`,
            }));

        callback(filteredDoctors);
    };

    const { toast } = useToast();

    const submitForm = useMutationWithTokenAPI('/api/appointment/');

    const onSubmit = (data: AppointmentFormValues) => {
        const transformedData = {
            patientId: Number(data.patient), // Already a number
            staffId: Number(data.doctor),    // Already a number
            startTime: String(`${data.date}T${data.startTime}:00.000Z`), // ISO 8601 format
            endTime: String(`${data.date}T${data.endTime}:00.000Z`),   // ISO 8601 format
            purpose: String(data.purpose),
        };

        submitForm.mutate(transformedData, {
            onSuccess: () => {
                form.reset();
                toast({
                    variant: "success",
                    title: "Appointment Created Successfully!",
                });
                setSelectedDoctor(null);
                setSelectedPatient(null);
                setIsOpen(false);
            },
            onError: (error: unknown) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message,
                });
                setIsOpen(false);
            },
        });
    };

    const [open, setOpen] = useState(false);
    const [patientsOptions, setPatientsOptions] = useState<{ value: string; label: string }[]>([]);
    const [inputValue, setInputValue] = useState('');

    const getApiEndpoint = (inputValue: string) => {
        return inputValue !== '' ? `/api/patient/name/${inputValue}` : `/api/patient/?order=asc&pageSize=20&pageNumber=1`;
    };

    const { data: patientsData, isLoading: patientsLoading } = useQueryWithTokenAPI<PatientResponse>(
        ['patient', inputValue],
        getApiEndpoint(inputValue)
    );

    useEffect(() => {
        if (!patientsLoading && patientsData) {
            const filteredPatientList = patientsData.data.map((patient) => ({
                value: patient.id.toString(),
                label: `${patient.first_name} ${patient.last_name}`,
            }));
            setPatientsOptions(filteredPatientList);
        }
    }, [patientsData, patientsLoading]);

    const handlePatientSelect = (patientId: string) => {
        const selected = patientsOptions.find((patient) => patient.value === patientId);
        setSelectedPatient(selected || null);
        form.setValue('patient', Number(patientId)); // Correctly update react-hook-form value
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Book Appointment</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        Select a doctor, patient, date, and purpose for your appointment
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="doctor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Doctor</FormLabel>
                                    <FormControl>
                                        <AsyncSelect
                                            cacheOptions
                                            loadOptions={loadDoctorOptions}
                                            defaultOptions
                                            onChange={(selectedOption) => {
                                                setSelectedDoctor(selectedOption);
                                                field.onChange(Number(selectedOption?.value) || 0); // Ensure value is a number
                                            }}
                                            value={selectedDoctor}
                                            placeholder="Select a doctor"
                                            isClearable
                                        />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.doctor?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="patient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patient</FormLabel>
                                    <FormControl>
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
                                                        onValueChange={(value) => setInputValue(value)}
                                                    />
                                                    <CommandList>
                                                        {patientsOptions.length > 0 ? (
                                                            <>
                                                                {patientsOptions.map((patient) => (
                                                                    <div
                                                                        className="relative flex items-center data-[selected=true]:bg-accent hover:bg-gray-100 data-[disabled=true]:opacity-50 px-2 py-1.5 rounded-sm text-sm data-[selected=true]:text-accent-foreground cursor-pointer data-[disabled=true]:pointer-events-none select-none outline-none"
                                                                        key={patient.value}
                                                                        onClick={() => handlePatientSelect(patient.value)}
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
                                                            </>
                                                        ) : (
                                                            <CommandEmpty>No patient found.</CommandEmpty>
                                                        )}
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.patient?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.date?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.startTime?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.endTime?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purpose</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter the purpose of the appointment" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.purpose?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Book Appointment</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
