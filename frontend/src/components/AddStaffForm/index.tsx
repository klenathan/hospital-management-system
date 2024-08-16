import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Department } from '@/types/department';
import { StaffMember } from '@/types/staffs';

interface AddStaffFormProps {
    departments: Department[];
    onAddStaff: (newStaff: StaffMember) => void;
}

const jobTypes = ['Doctor', 'Nurse', 'Admin'];

interface StaffFormData {
    first_name: string;
    last_name: string;
    department_id: number | '';
    job_type: string;
    qualifications: string;
    salary: number | '';
}

export default function AddStaffForm({ departments, onAddStaff }: AddStaffFormProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState<StaffFormData>({
        first_name: '',
        last_name: '',
        department_id: '',
        job_type: '',
        qualifications: '',
        salary: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDepartmentChange = (value: string) => {
        setFormData({
            ...formData,
            department_id: parseInt(value, 10),
        });
    };

    const handleJobTypeChange = (value: string) => {
        setFormData({
            ...formData,
            job_type: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Validate salary before submitting
        if (typeof formData.salary === 'string') {
            formData.salary = parseFloat(formData.salary);
        }
        if (formData.department_id === '') {
            alert('Please select a department');
            return;
        }
        onAddStaff(formData as StaffMember);
        setIsOpen(false);
    };

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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department_id">Department</Label>
                        <Select onValueChange={handleDepartmentChange}>
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
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="job_type">Job Type</Label>
                        <Select onValueChange={handleJobTypeChange}>
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
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="qualifications">Qualifications</Label>
                        <Input
                            id="qualifications"
                            name="qualifications"
                            value={formData.qualifications}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salary</Label>
                        <Input
                            id="salary"
                            name="salary"
                            type="number"
                            value={formData.salary}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Button type="submit">Add Staff</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
