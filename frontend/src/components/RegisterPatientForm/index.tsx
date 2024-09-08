import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutationWithTokenAPI } from '@/hooks/API/useMutationAPI';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const patientSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    dateOfBirth: z.string().min(1, "Date of birth is required.")
        .refine((date) => {
            const selectedDate = new Date(date);
            const currentDate = new Date();
            return selectedDate < currentDate;
        }, {
            message: "Date of birth must be before the current date.",
        }),
    gender: z.enum(['male', 'female'], {
        required_error: "Gender is required.",
        invalid_type_error: "Invalid gender selected.",
    }),
    contactInfo: z.string().min(9, "Contact information is required."),
    address: z.string().min(1, "Address is required."),
    allergies: z.string().optional(),
});


interface RegisterPatientFormProps {
    refetch: () => void;
}

export default function RegisterPatientForm({ refetch }: RegisterPatientFormProps) {


    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: null,  // Initialize with null
            contactInfo: '',
            address: '',
            allergies: '',
        }
    });

    const { toast } = useToast();
    const submitForm = useMutationWithTokenAPI('/api/patient/');

    const onSubmit = (data: { firstName: string; lastName: string; dateOfBirth: string; contactInfo: string; address: string; allergies: string; }) => {
        const transformedData = {
            first_name: data.firstName,
            last_name: data.lastName,
            date_of_birth: data.dateOfBirth,
            contact_info: data.contactInfo,
            address: data.address,
            allergies: data.allergies,
        };

        submitForm.mutate(transformedData, {
            onSuccess: () => {
                form.reset(); // Reset the form after submission
                setIsOpen(false); // Close the dialog
                toast({
                    variant: "success",
                    title: "Patient Registered Successfully!",
                });
                refetch(); // Refetch the data to update the list
            },
            onError: (error) => {
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
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset(); // Reset the form when the dialog is closed
                }
                setIsOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Register Patient
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter first name" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter last name" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.dateOfBirth?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value || null)}
                                            value={field.value || ""}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.gender?.message}</FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactInfo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Information</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter contact information" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.contactInfo?.message}</FormMessage>
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
                                        <Input {...field} placeholder="Enter address (optional)" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.address?.message}</FormMessage>
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
                                        <Input {...field} placeholder="Enter allergies (optional)" />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.allergies?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full'>Register</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
