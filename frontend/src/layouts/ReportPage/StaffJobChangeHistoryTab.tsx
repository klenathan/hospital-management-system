import AsyncSelect from 'react-select/async';
import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StaffJobChangeHistoryResponse } from '@/types/report';
import { StaffListResponse } from '@/types/staffs';
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import TableEmpty from '@/components/TableEmpty';
import { DepartmentResponse } from '@/types/department';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
    Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLast, PaginationFirst,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

export default function StaffJobChangeHistoryTab() {
    const [selectedStaff, setSelectedStaff] = useState<{ value: string; label: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [queryOrder, setQueryOrder] = useState(true);
    const [lastPage, setLastPage] = useState<number>(0);

    const { data: staffListData, isLoading: staffLoading } =
        useQueryWithTokenAPI<StaffListResponse>(
            ['staff'],
            '/api/staff/'
        );

    // const { data: staffHistoryData, isLoading: staffHistoryDataLoading } =
    //     useQueryWithTokenAPI<StaffJobChangeHistoryResponse>(
    //         ['staffHistory', selectedStaff?.value || ""],
    //         selectedStaff?.value !== undefined ? `/api/report/jobHistory/${selectedStaff.value}` : "/api/report/jobHistory/"
    //     );

    const getApiEndpoint = (queryOrder: boolean, pageSize: number, pageNumber: number) => {
        if (selectedStaff?.value !== undefined) {
            return `/api/report/jobHistory/${selectedStaff?.value}`;
        } else {
            return `/api/report/jobHistory/?order=${queryOrder ? 'asc' : 'desc'}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
        }
    };


    const { data: staffHistoryData, isLoading: staffHistoryDataLoading } =
        useQueryWithTokenAPI<StaffJobChangeHistoryResponse>(
            ['staffHistory', selectedStaff?.value || "", currentPage.toString(), queryOrder.toString()],
            getApiEndpoint(queryOrder, 10, currentPage)
        );

    const totalPages = selectedStaff?.value
        ? Math.ceil((staffHistoryData?.queryResult?.count || 0) / 10)
        : lastPage;



    useEffect(() => {
        if (staffHistoryData?.queryResult?.totalCount) {
            setLastPage(Math.ceil(staffHistoryData.queryResult.totalCount / 10));
        }
    }, [staffHistoryData])

    // Load options for AsyncSelect
    const loadOptions = (inputValue: string, callback: (options: { value: string, label: string }[]) => void) => {
        if (staffLoading || !staffListData) return;

        const filteredStaffList = staffListData.data
            .filter(staff =>
                `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 20) // Lazy loading the first 20 results
            .map(staff => ({
                value: staff.id.toString(),
                label: `${staff.first_name} ${staff.last_name}`,
            }));

        callback(filteredStaffList);
    };

    const handleStaffChange = (selectedOption: { value: string; label: string } | null) => {
        setSelectedStaff(selectedOption);
    };


    const { data: departmentListData, isLoading: departmentLoading } =
        useQueryWithTokenAPI<DepartmentResponse>(['patient'], '/api/department/');

    // Create a map of department ID to department name
    const departmentMap = departmentListData?.data.reduce((acc, department) => {
        acc[department.id] = department.name;
        return acc;
    }, {} as Record<number, string>);


    return (
        <div className="space-y-4">
            <div className='gap-5 grid grid-cols-3'>
                <div className='col-span-2'>
                    <Label htmlFor="staff">Staff Member</Label>
                    <AsyncSelect
                        id="staff"
                        cacheOptions
                        loadOptions={loadOptions}
                        defaultOptions
                        onChange={handleStaffChange}
                        value={selectedStaff}
                        placeholder="Select staff member"
                        isClearable
                    />
                </div>
                <div>
                    <Label htmlFor="sort">Sort Order</Label>
                    <Select onValueChange={(value) => setQueryOrder(value === 'asc' ? true : false)}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder={queryOrder ? 'Ascending' : 'Descending'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='asc'>Ascending</SelectItem>
                            <SelectItem value='desc'>Descending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>StaffID</TableHead>
                        <TableHead>Staff Name</TableHead>
                        <TableHead>Job Type</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Department</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staffHistoryDataLoading || departmentLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {staffHistoryData && staffHistoryData?.queryResult?.count === 0 ? (
                                <TableEmpty colSpan={6} />
                            ) : (
                                staffHistoryData?.data?.map((staff, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{staff.id}</TableCell>
                                        <TableCell>{staff.staff_id}</TableCell>
                                        <TableCell>{selectedStaff ? selectedStaff.label : staff.first_name + ' ' + staff.last_name} </TableCell>
                                        <TableCell>{staff.job_type}</TableCell>
                                        <TableCell>{staff.salary}</TableCell>
                                        {/* <TableCell>{staff.department_id}</TableCell> */}
                                        <TableCell>{departmentMap ? departmentMap[staff.department_id] : 'Unknown'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </>
                    )}
                </TableBody>
            </Table>


            {staffHistoryData && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationFirst
                                className={`${currentPage === 1 && 'cursor-not-allowed opacity-50'}`}
                                onClick={() => setCurrentPage(1)}
                            />
                        </PaginationItem>


                        <PaginationItem>
                            <PaginationPrevious
                                className={`${currentPage === 1 && 'cursor-not-allowed opacity-50'}`}
                                onClick={currentPage > 1 ? () => setCurrentPage(currentPage - 1) : undefined}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <div className='flex items-center w-max'>
                                <span>Page </span>
                                <Input
                                    type="number"
                                    value={currentPage}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        // Ensure the value is within valid page range
                                        if (value >= 1 && value <= totalPages) {
                                            setCurrentPage(value);
                                        }
                                    }}
                                    className='mx-2 w-16'
                                    min={1}
                                    max={totalPages}
                                />
                                <span className='w-max min-w-max'> of {totalPages}</span>
                            </div>
                        </PaginationItem>


                        <PaginationItem>
                            <PaginationNext
                                className={`${currentPage === totalPages && 'cursor-not-allowed opacity-50'}`}

                                onClick={currentPage < totalPages ? () => setCurrentPage(currentPage + 1) : undefined}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLast
                                className={`${currentPage === totalPages && 'cursor-not-allowed opacity-50'}`}

                                onClick={() => setCurrentPage(totalPages)}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
