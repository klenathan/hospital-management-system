import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Department } from '@/types/department';
import { LoaderCircle } from 'lucide-react';
import { useMutationWithTokenAPI } from '@/hooks/API/useMutationAPI';
import { useToast } from "@/components/ui/use-toast"
// Define the zod schema for validation
const staffSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    jobType: z.string().nonempty("Please select a job type."),
    qualification: z.string().nonempty("Please add a qualification."),
    deptId: z.number({
        required_error: "Please select a department."
    }).positive("Please select a department."),
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

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            jobType: "",
            qualification: "",
            deptId: 0,
            salary: 0
        },
    });

    const submitForm = useMutationWithTokenAPI('/api/staff/');

    const onSubmit = (data: StaffFormData) => {
        submitForm.mutate(data, {
            onSuccess: (response) => {
                form.reset();
                toast({
                    variant: "success",
                    title: "Staff Created Successfully!",
                    description: `Username: ${response.data.data[0].username}`,
                })
                setIsOpen(false)
            },
            onError: (error) => {
                console.error('Error submitting form:', error);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request",
                })
                setIsOpen(false)

            },
        });
    };

    const { toast } = useToast()


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>Add New Staff</Button>
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
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deptId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(value) => field.onChange(Number(value))}>
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
                            name="jobType"
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
                                    <FormMessage>{form.formState.errors.jobType?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="qualification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qualifications</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.qualification?.message}</FormMessage>
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
        </Dialog >
    );
}
