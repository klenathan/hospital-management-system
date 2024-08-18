import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutationWithoutTokenAPI } from '@/hooks/API/useMutationAPI';

// Define the zod schema for validation
const appointmentSchema = z.object({
    doctor: z.string().min(1, "Please select a doctor."),
    patient: z.string().min(1, "Please select a patient."),
    date: z.string().min(1, "Please select a date."),
    startTime: z.string().min(1, "Please select a start time."),
    endTime: z.string().min(1, "Please select an end time."),
    purpose: z.string().min(1, "Please enter the purpose of the appointment."),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function AppointmentForm() {
    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            doctor: '',
            patient: '',
            date: '',
            startTime: '',
            endTime: '',
            purpose: '',
        }
    });

    const doctors = [
        { id: 1, name: "Dr. Smith" },
        { id: 2, name: "Dr. Johnson" },
        { id: 3, name: "Dr. Williams" },
        { id: 4, name: "Dr. Davis" },
    ];

    const patients = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Bob Brown" },
        { id: 4, name: "Alice Green" },
    ];

    const submitForm = useMutationWithoutTokenAPI('/api/appointment/');


    const onSubmit = (data: AppointmentFormValues) => {
        console.log("Form data submitted:", data);

        // Call your API here with the form data
        submitForm.mutate(data, {
            onSuccess: () => {
                form.reset();
            },
        });
    };



    return (
        <Dialog>
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
                                        <select className="p-2 border rounded w-full" {...field}>
                                            <option value="" disabled>Select a doctor...</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id.toString()}>
                                                    {doctor.name}
                                                </option>
                                            ))}
                                        </select>
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
                                        <select className="p-2 border rounded w-full" {...field}>
                                            <option value="" disabled>Select a patient...</option>
                                            {patients.map((patient) => (
                                                <option key={patient.id} value={patient.id.toString()}>
                                                    {patient.name}
                                                </option>
                                            ))}
                                        </select>
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
