import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Department } from '@/types/department';
import { LoaderCircle } from 'lucide-react';
import { useMutationWithoutTokenAPI } from '@/hooks/API/useMutationAPI';
// Define the zod schema for validation
const staffSchema = z.object({
    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "Last name is required."),
    department_id: z.string().nonempty("Please select a department."),
    job_type: z.string().nonempty("Please select a job type."),
    qualifications: z.string().optional(),
    salary: z.preprocess(
        (value) => parseFloat(value as string),
        z.number().positive("Salary must be a positive number.")
    ),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface AddStaffFormProps {
    departments: Department[];
}

const jobTypes = ['Doctor', 'Nurse', 'Admin'];

export default function AddStaffForm({ departments }: AddStaffFormProps) {
    const form = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            job_type: "",
            qualifications: "",
            department_id: "",
            salary: 0,
        },
    });



    const submitForm = useMutationWithoutTokenAPI('/api/staff/');

    const onSubmit = (data: StaffFormData) => {
        submitForm.mutate(data, {
            onSuccess: () => {
                form.reset();
            },
        });
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add New Staff</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Staff Member</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Fill out the form below to add a new staff member.
                </DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.first_name?.message}</FormMessage>
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.last_name?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
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
                                    <FormMessage>{form.formState.errors.department_id?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="job_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Job Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jobTypes.map((job, index) => (
                                                    <SelectItem key={index} value={job}>
                                                        {job}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.job_type?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="qualifications"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualifications</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.qualifications?.message}</FormMessage>
                                    <FormDescription>Optional</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salary</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.salary?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full text-background" disabled={submitForm.isPending}>
                            {submitForm.isPending ? <LoaderCircle className="animate-spin" /> : <span>Add Staff</span>}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
