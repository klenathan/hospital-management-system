import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal } from 'lucide-react';
import { StaffMember, StaffListResponse } from '@/types/staffs';
import { DepartmentResponse } from '@/types/department';
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import AddCustomObjectForm from '@/components/AddCustomObjectForm';
import {
    Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext,
} from '@/components/ui/pagination';

import AddStaffForm from '@/components/AddStaffForm';

import StaffTable from '@/components/StaffTable';
import BlobList from '@/components/BlobList';
import { UpdateStaffInfoForm } from '@/components/UpdateStaffInfoForm';


export default function StaffManagement() {
    const [sortField, setSortField] = useState<'first_name' | 'id'>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState<number | 'all'>('all');
    // const [scheduleData, setScheduleData] = useState<any[]>([]); // Store multiple schedules
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);

    const itemsPerPage = 10;


    const { data: departmentListData, isLoading: departmentLoading } =
        useQueryWithTokenAPI<DepartmentResponse>(['department'], '/api/department/');

    const { data: staffListData, isLoading: staffLoading, refetch } =
        useQueryWithTokenAPI<StaffListResponse>(
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
                    <Dialog
                        open={openDialogId === staff.id}
                        onOpenChange={(open) => setOpenDialogId(open ? staff.id : null)}
                    >
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
                        <DialogContent className='w-max max-w-3xl'>
                            <DialogHeader>
                                <DialogTitle>{staff.first_name + " " + staff.last_name}</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue='info' className='w-max min-w-96'>
                                <TabsList>
                                    <TabsTrigger value='info'>Personal Info</TabsTrigger>
                                    <TabsTrigger value='custom-objects'>Custom Objects</TabsTrigger> {/* New Tab */}
                                </TabsList>

                                <TabsContent value='info'>
                                    <UpdateStaffInfoForm
                                        departments={departmentListData?.data || []}
                                        staffId={staff.id.toString()}
                                        defaultValues={{
                                            firstName: staff.first_name,
                                            lastName: staff.last_name,
                                            jobType: staff.job_type,
                                            qualification: staff.qualifications,
                                            deptId: staff.department_id,
                                            salary: Number(staff.salary),
                                        }}
                                        onSuccess={() => {
                                            setOpenDialogId(null);
                                            refetch();
                                        }}
                                        onCancel={() => {
                                            setOpenDialogId(null);
                                        }}
                                    />
                                </TabsContent>

                                <TabsContent value='custom-objects' className='gap-5 grid'> {/* New Tab Content */}
                                    <BlobList domain='staff' parent={staff.id.toString()} />
                                    <AddCustomObjectForm domain='staff' parentID={staff.id.toString()} />
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
        </div >
    );
}
