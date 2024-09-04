import React, { useContext } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StaffMember } from '@/types/staffs';
import { DepartmentResponse } from '@/types/department';
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import { UserContext } from '@/hooks/Auth/UserContext';


interface StaffTableProps {
    staffData: Array<StaffMember>;
    isLoading?: boolean;
    children: (staff: StaffMember) => React.ReactNode;
}

const StaffTable: React.FC<StaffTableProps> = ({ staffData, isLoading, children }) => {
    const { data: departmentListData, isLoading: departmentLoading } =
        useQueryWithTokenAPI<DepartmentResponse>(['patient'], '/api/department/');

    // Create a map of department ID to department name
    const departmentMap = departmentListData?.data.reduce((acc, department) => {
        acc[department.id] = department.name;
        return acc;
    }, {} as Record<number, string>);

    const { user } = useContext(UserContext);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Qualifications</TableHead>
                    <TableHead>Department</TableHead>
                    {user.job_type === 'Admin' &&
                        <>
                            <TableHead>Salary</TableHead>
                            <TableHead className='text-center'>Actions</TableHead>
                        </>
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading || departmentLoading ?
                    <TableRow>
                        <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                    </TableRow>
                    :
                    <>{staffData.map((staff, index) => (
                        <TableRow key={staff.id}>
                            <TableCell>{staff.id}</TableCell>
                            <TableCell>{staff.first_name}</TableCell>
                            <TableCell>{staff.last_name}</TableCell>
                            <TableCell>{staff.job_type}</TableCell>
                            <TableCell>{staff.qualifications}</TableCell>
                            <TableCell>{departmentMap ? departmentMap[staff.department_id] : 'Unknown'}</TableCell>
                            {user.job_type === 'Admin' &&
                                <>
                                    <TableCell>{new Intl.NumberFormat().format(Number(staff.salary))}</TableCell>
                                    <TableCell key={index} className='text-center'>
                                        {children(staff)}
                                    </TableCell>
                                </>
                            }
                        </TableRow>
                    ))}</>
                }
            </TableBody>
        </Table>
    );
};

export default StaffTable;
