import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreHorizontal, Plus } from "lucide-react"

interface Staff {
    id: number;
    name: string;
    department: string;
    schedule: string;
    customObjects: CustomObject[];
}

interface CustomObject {
    type: string;
    content: string;
}

export default function StaffManagement() {
    const [staffList, setStaffList] = useState<Staff[]>([
        { id: 1, name: 'John Doe', department: 'IT', schedule: 'Mon-Fri 9-5', customObjects: [] },
        { id: 2, name: 'Jane Smith', department: 'HR', schedule: 'Tue-Sat 10-6', customObjects: [] },
        // Add more mock data as needed
    ])
    const [filterDepartment, setFilterDepartment] = useState<string>('')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)

    const filteredStaff = staffList
        .filter(staff => filterDepartment ? staff.department === filterDepartment : true)
        .sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))

    const addCustomObject = (staffId: number, objectType: string, content: string) => {
        setStaffList(prevList =>
            prevList.map(staff =>
                staff.id === staffId
                    ? { ...staff, customObjects: [...staff.customObjects, { type: objectType, content }] }
                    : staff
            )
        )
    }

    return (
        <div className="mx-auto p-6 container">
            <h1 className="mb-6 font-bold text-2xl">Staff Management</h1>

            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <Select onValueChange={setFilterDepartment}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Departments</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            {/* Add more departments as needed */}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
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
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Enter staff name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" placeholder="Enter department" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schedule">Schedule</Label>
                                <Input id="schedule" placeholder="Enter schedule" />
                            </div>
                            <Button type="submit">Add Staff</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStaff.map(staff => (
                        <TableRow key={staff.id}>
                            <TableCell>{staff.name}</TableCell>
                            <TableCell>{staff.department}</TableCell>
                            <TableCell>{staff.schedule}</TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="p-0 w-8 h-8">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56">
                                        <div className="gap-4 grid">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" className="justify-start w-full" onClick={() => setSelectedStaff(staff)}>
                                                        View Details
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
                                                            <form className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="staff-name">Name</Label>
                                                                    <Input id="staff-name" defaultValue={staff.name} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="staff-department">Department</Label>
                                                                    <Input id="staff-department" defaultValue={staff.department} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="staff-schedule">Schedule</Label>
                                                                    <Input id="staff-schedule" defaultValue={staff.schedule} />
                                                                </div>
                                                                <Button type="submit">Update Info</Button>
                                                            </form>
                                                        </TabsContent>
                                                        <TabsContent value="custom">
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
                                                                                <DialogDescription>Add a new custom object for {staff.name}</DialogDescription>
                                                                            </DialogHeader>
                                                                            <form className="space-y-4" onSubmit={(e) => {
                                                                                const target = e.target as HTMLFormElement;
                                                                                addCustomObject(staff.id, target.objectType.value, target.objectContent.value);
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
                                                                {staff.customObjects.length > 0 ? (
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
                                                        </TabsContent>
                                                    </Tabs>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" className="justify-start w-full">
                                                        Update Schedule
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Update Staff Schedule</DialogTitle>
                                                        <DialogDescription>Modify the schedule for {staff.name}</DialogDescription>
                                                    </DialogHeader>
                                                    <form className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="new-schedule">New Schedule</Label>
                                                            <Input id="new-schedule" placeholder="Enter new schedule" defaultValue={staff.schedule} />
                                                        </div>
                                                        <Button type="submit">Update Schedule</Button>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}