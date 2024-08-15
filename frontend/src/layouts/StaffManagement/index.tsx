import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MoreHorizontal, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { StaffMember } from '@/types/staffs';
import { Department } from '@/types/staffs';
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';

export default function StaffManagement() {
    const [filterDepartment, setFilterDepartment] = useState<number | ''>('');
    const [sortOrder, setSortOrder] = useState('asc');

    const { data: staffList = [], isLoading: staffLoading } = useQueryWithoutTokenAPI<StaffMember[]>(['staff'], '/api/staff/');
    const { data: departments = [], isLoading: departmentsLoading } = useQueryWithoutTokenAPI<Department[]>(['departments'], '/api/departments/');

    const filteredStaff = staffList
        .filter(staff => filterDepartment ? staff.department_id === filterDepartment : true)
        .sort((a, b) => sortOrder === 'asc' ? a.first_name.localeCompare(b.first_name) : b.first_name.localeCompare(a.first_name));

    if (staffLoading || departmentsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto p-6 container">
            <h1 className="mb-6 font-bold text-2xl">Staff Management</h1>

            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <Select onValueChange={(value) => setFilterDepartment(value === 'all' ? '' : parseInt(value))}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by Name" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">A-Z</SelectItem>
                            <SelectItem value="desc">Z-A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add New Staff</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Staff</DialogTitle>
                            <DialogDescription>Enter the details of the new staff member</DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            // Add new staff logic here
                            form.reset();
                        }}>
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input id="first_name" name="first_name" placeholder="Enter first name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input id="last_name" name="last_name" placeholder="Enter last name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select name="department" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">Add Staff</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStaff.map(staff => (
                        <TableRow key={staff.id}>
                            <TableCell>{staff.first_name}</TableCell>
                            <TableCell>{staff.last_name}</TableCell>
                            <TableCell>{departments.find(dept => dept.id === staff.department_id)?.name || 'Unknown'}</TableCell>
                            <TableCell>{format(new Date(staff.created_at), "PPP")}</TableCell>
                            <TableCell className="text-right">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="p-0 w-8 h-8">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Staff Details</DialogTitle>
                                        </DialogHeader>
                                        <Tabs defaultValue="info" className="w-full">
                                            <TabsList>
                                                <TabsTrigger value="info">Personal Info</TabsTrigger>
                                                <TabsTrigger value="custom">Custom Objects</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="info">
                                                <form className="space-y-4" onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const form = e.target as HTMLFormElement;
                                                    // Update staff info logic here
                                                }}>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="staff-first_name">First Name</Label>
                                                        <Input id="staff-first_name" name="first_name" defaultValue={staff.first_name} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="staff-last_name">Last Name</Label>
                                                        <Input id="staff-last_name" name="last_name" defaultValue={staff.last_name} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="staff-department">Department</Label>
                                                        <Select name="department" defaultValue={staff.department_id.toString()}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a department" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {departments.map((dept) => (
                                                                    <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button type="submit">Update Info</Button>
                                                </form>
                                            </TabsContent>
                                            {/* <TabsContent value="custom">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold text-lg">Custom Objects</h3>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button size="sm">
                                                                    <Plus className="mr-2 w-4 h-4" />
                                                                    Add Object
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Add Custom Object</DialogTitle>
                                                                    <DialogDescription>Add a new custom object for {staff.first_name} {staff.last_name}</DialogDescription>
                                                                </DialogHeader>
                                                                <form className="space-y-4" onSubmit={(e) => {
                                                                    e.preventDefault();
                                                                    const form = e.target as HTMLFormElement;
                                                                    // Add custom object logic here
                                                                    form.reset();
                                                                }}>
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="object-type">Object Type</Label>
                                                                        <Select name="objectType">
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select object type" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="note">Note</SelectItem>
                                                                                <SelectItem value="image">Image</SelectItem>
                                                                                <SelectItem value="document">Document</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="object-content">Content</Label>
                                                                        <Textarea name="objectContent" placeholder="Enter note or description" />
                                                                    </div>
                                                                    <Button type="submit">Add Custom Object</Button>
                                                                </form>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                    {staff.customObjects && staff.customObjects.length > 0 ? (
                                                        <ul className="space-y-2">
                                                            {staff.customObjects.map((obj, index) => (
                                                                <li key={index} className="flex justify-between items-center bg-muted p-2 rounded">
                                                                    <span>{obj.type}: {obj.content}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-muted-foreground">No custom objects added yet.</p>
                                                    )}
                                                </div>
                                            </TabsContent> */}
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
