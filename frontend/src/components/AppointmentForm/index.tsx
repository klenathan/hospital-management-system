import AsyncSelect from 'react-select/async';
import { useState } from 'react';
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

    const { data: patientsData, isLoading: patientsLoading } =
        useQueryWithTokenAPI<PatientResponse>(['patients'], '/api/patient/');

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

    const loadPatientOptions = (inputValue: string, callback: (options: { value: string, label: string }[]) => void) => {
        if (patientsLoading || !patientsData) return;

        const filteredPatients = patientsData.data
            .filter(patient =>
                `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 20)
            .map(patient => ({
                value: patient.id.toString(),
                label: `${patient.first_name} ${patient.last_name}`,
            }));

        callback(filteredPatients);
    };


    const { toast } = useToast()


    const submitForm = useMutationWithTokenAPI('/api/appointment/');

    const onSubmit = (data: AppointmentFormValues) => {

        // Transform the form data to match the expected API request format
        const transformedData = {
            patientId: data.patient, // Already a number
            staffId: data.doctor,    // Already a number
            startTime: `${data.date}T${data.startTime}:00.000Z`, // ISO 8601 format
            endTime: `${data.date}T${data.endTime}:00.000Z`,   // ISO 8601 format
            purpose: data.purpose,
        };

        submitForm.mutate({ data: transformedData }, {
            onSuccess: () => {
                form.reset();
                toast({
                    variant: "success",
                    title: "Appointment Created Successfully!",
                    // description: `${response}`,
                });
                setSelectedDoctor(null);
                setSelectedPatient(null);
                setIsOpen(false);
            },
            onError: (error) => {
                console.error('Error submitting form:', error);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
                setIsOpen(false);
            },
        });
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
                                        <AsyncSelect
                                            cacheOptions
                                            loadOptions={loadPatientOptions}
                                            defaultOptions
                                            onChange={(selectedOption) => {
                                                setSelectedPatient(selectedOption);
                                                field.onChange(Number(selectedOption?.value) || 0); // Ensure value is a number
                                            }}
                                            value={selectedPatient}
                                            placeholder="Select a patient"
                                            isClearable
                                        />
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
