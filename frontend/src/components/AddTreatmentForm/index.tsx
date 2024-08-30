import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { useMutationWithTokenAPI } from '@/hooks/API/useMutationAPI';
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import AsyncSelect from 'react-select/async';
import { StaffListResponse } from '@/types/staffs';

// Define the validation schema using Zod
const addTreatmentSchema = z.object({
    staffId: z.number().positive("Doctor is required."),
    treatmentDate: z.string().min(1, "Treatment date is required."),
    treatmentDetail: z.string().min(1, "Treatment detail is required."),
});

type AddTreatmentFormValues = z.infer<typeof addTreatmentSchema>;

// Define the component's props
interface AddTreatmentFormProps {
    patientId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AddTreatmentForm({
    patientId,
    onSuccess,
    onCancel,
}: AddTreatmentFormProps) {

    const { toast } = useToast();

    // Fetch doctors list for the staff selection
    const { data: doctorsListData, isLoading: doctorsLoading } =
        useQueryWithTokenAPI<StaffListResponse>(
            ['doctor'],
            '/api/staff/doctors/'
        );

    // Initialize the form with default values
    const form = useForm<AddTreatmentFormValues>({
        resolver: zodResolver(addTreatmentSchema),
        defaultValues: {
            staffId: 0,
            treatmentDate: '',
            treatmentDetail: '',
        },
    });

    // Mutation for submitting the form
    const submitForm = useMutationWithTokenAPI('/api/patient/treatment');

    // Load doctor options for AsyncSelect
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

    // Handle form submission
    const handleSubmit = (data: AddTreatmentFormValues) => {
        const transformedData = {
            patientId, // Passed as a prop
            staffId: data.staffId,
            treatmentDate: data.treatmentDate,
            treatmentDetail: data.treatmentDetail,
        };

        // Perform the mutation with the transformed data
        submitForm.mutate(transformedData, {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Treatment Added Successfully!",
                });
                form.reset();
                if (onSuccess) {
                    onSuccess();
                }
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
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="staffId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Doctor</FormLabel>
                            <FormControl>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadDoctorOptions}
                                    defaultOptions
                                    onChange={(selectedOption) => {
                                        field.onChange(Number(selectedOption?.value) || 0); // Ensure value is a number
                                    }}
                                    placeholder="Select a doctor"
                                    isClearable
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="treatmentDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Treatment Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder="Select treatment date"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="treatmentDetail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Treatment Detail</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter treatment detail"
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
                        Add Treatment
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
