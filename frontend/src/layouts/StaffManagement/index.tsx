import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal } from 'lucide-react';
import { StaffMember, StaffListResponse } from '@/types/staffs';
import { DepartmentResponse } from '@/types/department';
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';

import {
    Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext,
} from '@/components/ui/pagination';

import AddStaffForm from '@/components/AddStaffForm';

import StaffTable from '@/components/StaffTable';


export default function StaffManagement() {
    const [sortField, setSortField] = useState<'first_name' | 'id'>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState<number | 'all'>('all');
    // const [scheduleData, setScheduleData] = useState<any[]>([]); // Store multiple schedules

    const itemsPerPage = 10;


    const { data: departmentListData, isLoading: departmentLoading } =
        useQueryWithoutTokenAPI<DepartmentResponse>(['department'], '/api/department/');

    const { data: staffListData, isLoading: staffLoading, refetch } =
        useQueryWithoutTokenAPI<StaffListResponse>(
            ['staff', selectedDepartment.toString()], selectedDepartment === 'all'
            ? '/api/staff/'
            : `/api/staff/department/${selectedDepartment}`
        );

    // Ensure staffList is always an array
    const staffList = Array.isArray(staffListData?.data) ? staffListData.data : [];

    // Sort the staff list based on the sortField and sortOrder state
    const sortedStaff = staffList.sort((a, b) => {
        if (!sortField) {
            // Default sorting by ID in ascending order when no sorting is selected
            return a.id - b.id;
        }

        const aField = a[sortField as keyof StaffMember];
        const bField = b[sortField as keyof StaffMember];

        if (sortOrder === 'asc') {
            return aField < bField ? -1 : 1;
        } else {
            return aField > bField ? -1 : 1;
        }
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
    const paginatedStaff = sortedStaff.slice(
        (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when department or sorting changes
        refetch(); // Refetch data when department is changed
    }, [selectedDepartment, sortField, sortOrder, refetch]);

    if (staffLoading || departmentLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex-1 p-6'>
            <h1 className='mb-6 font-bold text-2xl'>Staff Management</h1>

            <div className='flex justify-between items-center mb-4'>
                <div className='flex space-x-4'>
                    {/* Filter by Department */}
                    <Select
                        onValueChange={(value) => setSelectedDepartment(value === 'all' ? 'all' : parseInt(value))}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Filter by Department' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Departments</SelectItem>
                            {departmentListData?.data.map(department => (
                                <SelectItem
                                    key={department.id}
                                    value={department.id.toString()}
                                >
                                    {department.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort by Options */}
                    <Select
                        defaultValue='none'
                        onValueChange={(value) => {
                            if (value === 'none') {
                                setSortField('id');
                                setSortOrder('asc'); // Default to ascending when no sorting is selected
                            } else {
                                setSortField(value as 'first_name');
                                setSortOrder('asc'); // Reset to ascending when a new field is selected
                            }
                        }}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Sort by' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='none'>ID</SelectItem>
                            <SelectItem value='first_name'>Name</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort Order */}
                    <Select
                        onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Sort Order' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='asc'>Ascending</SelectItem>
                            <SelectItem value='desc'>Descending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AddStaffForm departments={departmentListData?.data || []} />

            </div>

            <StaffTable staffData={paginatedStaff}>
                {(staff) => (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant='ghost'
                                className='p-0 w-8 h-8'
                            // onClick={() => setSelectedStaffId(staff.id)}
                            >
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='w-4 h-4' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-3xl'>
                            <DialogHeader>
                                <DialogTitle>{staff.first_name + " " + staff.last_name}</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue='info' className='w-full'>
                                <TabsList>
                                    <TabsTrigger value='info'>Personal Info</TabsTrigger>
                                    <TabsTrigger value='custom-objects'>Custom Objects</TabsTrigger> {/* New Tab */}
                                </TabsList>

                                <TabsContent value='info'>
                                    <form
                                        className='space-y-4'
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const firstName = (form.elements.namedItem('staff-first_name') as HTMLInputElement).value;
                                            const LastName = (form.elements.namedItem('staff-last_name') as HTMLInputElement).files?.[0]?.name;
                                            console.log("Form: " + firstName + " " + LastName);
                                            // Update staff info logic here
                                        }}
                                    >
                                        <div className='space-y-2'>
                                            <Label htmlFor='staff-first_name'>First Name</Label>
                                            <Input
                                                id='staff-first_name'
                                                name='first_name'
                                                defaultValue={staff.first_name}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='staff-last_name'>Last Name</Label>
                                            <Input
                                                id='staff-last_name'
                                                name='last_name'
                                                defaultValue={staff.last_name}
                                            />
                                        </div>
                                        <Button type='submit'>Update Info</Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value='custom-objects'> {/* New Tab Content */}
                                    <form
                                        className='space-y-4'
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const note = (form.elements.namedItem('custom_note') as HTMLInputElement).value;
                                            const image = (form.elements.namedItem('custom_image') as HTMLInputElement).files?.[0]?.name;

                                            console.log("Note: " + note);
                                            console.log("Image: " + image);

                                            // Logic to add custom objects (e.g., notes, images)
                                        }}
                                    >
                                        <div className='space-y-2'>
                                            <Label htmlFor='custom_note'>Add a Note</Label>
                                            <Input
                                                id='custom_note'
                                                name='custom_note'
                                                placeholder='Enter your note here'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='custom_image'>Upload an Image</Label>
                                            <Input
                                                id='custom_image'
                                                name='custom_image'
                                                type='file'
                                                accept='image/*'
                                            />
                                        </div>
                                        <Button type='submit'>Add Custom Object</Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                        </DialogContent>
                    </Dialog>
                )}
            </StaffTable>



            {/* Pagination Controls */}
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={currentPage !== 1 ? () => setCurrentPage((prev) => Math.max(prev - 1, 1)) : () => { }}
                        />
                    </PaginationItem>

                    {/* Render first page if it's not within the visible range */}
                    {currentPage > 2 && (
                        <>
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={() => setCurrentPage(1)}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        </>
                    )}

                    {/* Render visible pages */}
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                            pageNumber === currentPage ||
                            pageNumber === currentPage - 1 ||
                            pageNumber === currentPage + 1
                        ) {
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => setCurrentPage(pageNumber)}
                                        isActive={currentPage === pageNumber}
                                        className={pageNumber === currentPage ? 'active' : ''}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        }
                        return null;
                    })}

                    {/* Render last page if it's not within the visible range */}
                    {currentPage < totalPages - 1 && (
                        <>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={() => setCurrentPage(totalPages)}

                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={currentPage !== totalPages ? () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)) : () => { }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
