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
const updatePatientSchema = z.object({
    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "Last name is required."),
    date_of_birth: z.string().min(1, "Date of birth is required."),
    contact_info: z.string().min(1, "Contact information is required."),
    address: z.string().optional(),
    allergies: z.string().optional(),
});

type UpdatePatientFormValues = z.infer<typeof updatePatientSchema>;

// Define types for API response and request payload
interface UpdatePatientResponse {
    success: boolean;
    // Include other response fields if necessary
}

interface UpdatePatientVariables {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    contact_info: string;
    address?: string;
    allergies?: string;
}

// Define the component's props
interface UpdatePatientInfoFormProps {
    patientId: string | null;
    defaultValues: UpdatePatientFormValues;
    onSuccess: () => void;
    onCancel: () => void;
}

export function UpdatePatientInfoForm({
    patientId,
    defaultValues,
    onSuccess,
    onCancel,
}: UpdatePatientInfoFormProps) {

    const { toast } = useToast();

    // Initialize the form with default values
    const form = useForm<UpdatePatientFormValues>({
        resolver: zodResolver(updatePatientSchema),
        defaultValues,
    });

    // Initialize the PUT mutation using the hook
    const updatePatient = usePutWithTokenAPI<UpdatePatientResponse, UpdatePatientVariables>(
        `/api/patient/${patientId}`,
        {
            onSuccess: () => {
                // Optionally handle additional actions on success
            },
        }
    );

    // Handle form submission
    const handleSubmit = (data: UpdatePatientFormValues) => {
        if (patientId) {
            const transformedData: UpdatePatientVariables = {
                first_name: data.first_name,
                last_name: data.last_name,
                date_of_birth: data.date_of_birth,
                contact_info: data.contact_info,
                address: data.address,
                allergies: data.allergies,
            };

            // Perform the mutation with the transformed data
            updatePatient.mutate(transformedData, {
                onSuccess: () => {
                    form.reset();
                    toast({
                        variant: "success",
                        title: "Patient Information Updated Successfully!",
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
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter first name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter last name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact_info"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Information</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter contact information"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter allergies"
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
