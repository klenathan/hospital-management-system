import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StaffJobChangeHistoryResponse } from '@/types/report';
import { StaffListResponse } from '@/types/staffs';
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import TableEmpty from '@/components/TableEmpty';
import { DepartmentResponse } from '@/types/department';

export default function StaffJobChangeHistoryTab() {
    const [selectedStaff, setSelectedStaff] = useState<{ value: string; label: string } | null>(null);

    const { data: staffListData, isLoading: staffLoading } =
        useQueryWithTokenAPI<StaffListResponse>(
            ['staff'],
            '/api/staff/'
        );

    const { data: staffHistoryData, isLoading: staffHistoryDataLoading } =
        useQueryWithTokenAPI<StaffJobChangeHistoryResponse>(
            ['staffHistory', selectedStaff?.value || ""],
            selectedStaff?.value !== undefined ? `/api/report/jobHistory/${selectedStaff.value}` : "/api"
        );

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
            <div>
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
                            {staffHistoryData && staffHistoryData?.queryResult?.count === 0 || selectedStaff?.value === undefined ? (
                                <TableEmpty colSpan={6} />
                            ) : (
                                staffHistoryData?.data?.map((staff, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{staff.id}</TableCell>
                                        <TableCell>{staff.staff_id}</TableCell>
                                        <TableCell>{selectedStaff?.label}</TableCell>
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
        </div>
    );
}
