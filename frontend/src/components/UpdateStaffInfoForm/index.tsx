import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { Department } from '@/types/department';
import { usePutWithTokenAPI } from '@/hooks/API/useEditAPI';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the validation schema using Zod
const updateStaffSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    jobType: z.string().min(1, "Job type is required."),
    qualification: z.string().min(1, "Qualification is required."),
    deptId: z.number().int().positive("Department ID must be a positive number."),
    salary: z.number().positive("Salary must be a positive number."),
});

type UpdateStaffFormValues = z.infer<typeof updateStaffSchema>;

// Define types for API response and request payload
interface UpdateStaffResponse {
    success: boolean;
}

interface UpdateStaffVariables {
    firstName: string;
    lastName: string;
    jobType: string;
    qualification: string;
    deptId: number;
    salary: number;
}

// Define the component's props
interface UpdateStaffInfoFormProps {
    departments: Department[];
    staffId: string | null;
    defaultValues: UpdateStaffFormValues;
    onSuccess: () => void;
    onCancel: () => void;
}

export function UpdateStaffInfoForm({
    departments,
    staffId,
    defaultValues,
    onSuccess,
    onCancel,
}: UpdateStaffInfoFormProps) {
    const { toast } = useToast();

    // Initialize the form with default values
    const form = useForm<UpdateStaffFormValues>({
        resolver: zodResolver(updateStaffSchema),
        defaultValues,
    });



    // Initialize the PUT mutation using the hook
    const updateStaff = usePutWithTokenAPI<UpdateStaffResponse, UpdateStaffVariables>(
        `/api/staff/${staffId}`,
        {
            onSuccess: () => {
                // Optionally handle additional actions on success
                form.reset();
                toast({
                    variant: "success",
                    title: "Staff Information Updated Successfully!",
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
        }
    );

    // Handle form submission
    const handleSubmit = (data: UpdateStaffFormValues) => {
        if (staffId) {
            const transformedData: UpdateStaffVariables = {
                firstName: data.firstName,
                lastName: data.lastName,
                jobType: data.jobType,
                qualification: data.qualification,
                deptId: data.deptId,
                salary: data.salary,
            };

            // Perform the mutation with the transformed data
            updateStaff.mutate(transformedData);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="gap-5 grid grid-cols-2">
                <FormField
                    control={form.control}
                    name="firstName"
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
                    name="lastName"
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
                    name="jobType"
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                            <FormLabel>Job Type</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter job type"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                            <FormLabel>Qualification</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter qualification"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="deptId"
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((department) => (
                                            <SelectItem key={department.id} value={department.id.toString()}>
                                                {department.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage>{form.formState.errors.deptId?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                            <FormLabel>Salary</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter salary"
                                    {...field}
                                    onChange={event => field.onChange(+event.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className='col-span-2'>
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
