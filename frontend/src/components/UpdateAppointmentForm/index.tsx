// UpdateAppointmentForm.tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { usePutWithTokenAPI } from '@/hooks/API/useEditAPI';

// Define the validation schema using Zod
const updateAppointmentSchema = z.object({
    date: z.string().min(1, "Please select a date."),
    startTime: z.string().min(1, "Please select a start time."),
    endTime: z.string().min(1, "Please select an end time."),
}).refine((data) => {
    const start = new Date(`${data.date}T${data.startTime}`);
    const end = new Date(`${data.date}T${data.endTime}`);
    return end > start;
}, {
    message: "End time must be later than start time.",
    path: ["endTime"],
});

type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentSchema>;

// Define types for API response and request payload
interface UpdateAppointmentResponse {
    success: boolean;
    // Include other response fields if necessary
}

interface UpdateAppointmentVariables {
    appointmentId: number;
    newStartTime: string;
    newEndTime: string;
}

// Define the component's props
interface UpdateAppointmentFormProps {
    appointmentId: number | null;
    startDate: Date;
    endDate: Date;
    onSuccess: () => void;
    onCancel: () => void;
    staffId: number;
}

export function UpdateAppointmentForm({
    appointmentId,
    startDate,
    endDate,
    onSuccess,
    onCancel,
    staffId,
}: UpdateAppointmentFormProps) {

    const { toast } = useToast();

    // Initialize the form with default values
    const form = useForm<UpdateAppointmentFormValues>({
        resolver: zodResolver(updateAppointmentSchema),
        defaultValues: {
            date: startDate.toISOString().split('T')[0],
            startTime: startDate.toISOString().split('T')[1].slice(0, 5),
            endTime: endDate.toISOString().split('T')[1].slice(0, 5),
        }
    });

    // Initialize the PUT mutation using the revised hook
    const updateAppointment = usePutWithTokenAPI<UpdateAppointmentResponse, UpdateAppointmentVariables>(
        `/api/staff/schedule/${staffId}`, // Adjust the URL as needed
        {
            onSuccess: () => {
                // Optionally handle additional actions on success
            },
        }
    );

    // Handle form submission
    const handleSubmit = (data: UpdateAppointmentFormValues) => {
        if (appointmentId) {
            const transformedData: UpdateAppointmentVariables = {
                appointmentId,
                newStartTime: `${data.date}T${data.startTime}:00.000Z`,
                newEndTime: `${data.date}T${data.endTime}:00.000Z`,
            };

            // Perform the mutation with the transformed data
            updateAppointment.mutate(transformedData, {
                onSuccess: () => {
                    form.reset();
                    toast({
                        variant: "success",
                        title: "Appointment Updated Successfully!",
                    });
                    onSuccess();
                },
                onError: (error: unknown) => {
                    console.error('Error submitting form:', error);
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    });
                },
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder={startDate.toISOString().split('T')[0]}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
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
                                <Input
                                    type="time"
                                    placeholder={startDate.toISOString().split('T')[1].slice(0, 5)}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
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
                                <Input
                                    type="time"
                                    placeholder={endDate.toISOString().split('T')[1].slice(0, 5)}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit">
                        Update
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
