import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkingSchedule } from '@/types/appointment';
import { DepartmentResponse } from '@/types/department';
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';

interface AppointmentTableProps {
    appointmentData: Array<WorkingSchedule>;
    isLoading?: boolean;
    children: (staff: WorkingSchedule) => React.ReactNode;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointmentData, isLoading, children }) => {
    const { data: departmentListData, isLoading: departmentLoading } =
        useQueryWithoutTokenAPI<DepartmentResponse>(['department'], '/api/department/');

    // Create a map of department ID to department name
    const departmentMap = departmentListData?.data.reduce((acc, department) => {
        acc[department.id] = department.name;
        return acc;
    }, {} as Record<number, string>);

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
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading || departmentLoading ?
                    <TableRow>
                        <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                    </TableRow>
                    :
                    <>{appointmentData.map((appointment, index) => (
                        <TableRow key={appointment.id}>
                            <TableCell>{appointment.id}</TableCell>
                            <TableCell>{appointment.first_name}</TableCell>
                            <TableCell>{appointment.last_name}</TableCell>
                            <TableCell>{appointment.job_type}</TableCell>
                            <TableCell>{appointment.qualifications}</TableCell>
                            <TableCell>{departmentMap ? departmentMap[appointment.department_id] : 'Unknown'}</TableCell>
                            <TableCell>{appointment.salary}</TableCell>
                            <TableCell>{appointment.busy ?
                                <span className='bg-red-200 px-2 py-1 rounded-md text-red-800'>
                                    Busy
                                </span>
                                :
                                <span className='bg-lime-200 px-2 py-1 rounded-md text-lime-800'>
                                    Available
                                </span>
                            }</TableCell>
                            <TableCell key={index} className='text-center'>
                                {children(appointment)}
                            </TableCell>
                        </TableRow>
                    ))}</>
                }
            </TableBody>
        </Table>
    );
};

export default AppointmentTable;
