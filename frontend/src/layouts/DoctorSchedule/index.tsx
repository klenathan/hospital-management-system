import { useContext } from 'react';
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import AppointmentForm from '@/components/AppointmentForm';
import { UserContext } from '@/hooks/Auth/UserContext';
import { Navigate } from 'react-router-dom';

import { DoctorScheduleResponse } from '@/types/schedule';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import DoctorScheduleForm from '@/components/DoctorScheduleForm';

export default function DoctorSchedule() {

    const { user } = useContext(UserContext);
    const { data: scheduleData, isLoading: scheduleLoading, refetch } = useQueryWithTokenAPI<DoctorScheduleResponse>(
        ['schedule', user.userID.toString()], `/api/appointment/schedule/byDoctor/${user.userID}`
    );



    if (user.job_type === 'Admin') {
        return <Navigate to="/staff" replace />;
    } else if (user.job_type === 'Nurse') {
        return <Navigate to="/patient" replace />;
    }

    function getFormattedDate(date: Date) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    return (
        <div className="flex-1 p-6">
            <h1 className="mb-6 font-bold text-2xl">Appointment Management</h1>

            <div className="flex sm:flex-row flex-col justify-end items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
                <AppointmentForm refetch={refetch} />
            </div>
            <div className="flex overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Patient ID</TableHead>
                            <TableHead>Staff ID</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead className='text-center'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduleData?.data.length === 0 || scheduleLoading ?
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                            </TableRow>
                            :
                            <>
                                {scheduleData?.data.map((schedule, index) => (
                                    <TableRow key={schedule.id + index}>
                                        <TableCell>{schedule.id}</TableCell>
                                        <TableCell>{schedule.patient_id}</TableCell>
                                        <TableCell>{schedule.staff_id}</TableCell>
                                        <TableCell>{getFormattedDate(new Date(schedule.start_time))}</TableCell>
                                        <TableCell>{getFormattedDate(new Date(schedule.end_time))}</TableCell>
                                        <TableCell>{schedule.purpose}</TableCell>
                                        <TableCell>
                                            {/* <Dialog open={openDialogId === schedule.id}
                                                onOpenChange={(isOpen) => setOpenDialogId(isOpen ? schedule.id : null)}

                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant='ghost'
                                                        className='p-0 w-8 h-8'
                                                        onClick={() => { setOpenDialogId(schedule.id); }}
                                                    >
                                                        <span className='sr-only'>Open menu</span>
                                                        <MoreHorizontal className='w-4 h-4' />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className='max-w-3xl'>
                                                    <DialogHeader>
                                                        <DialogTitle>{schedule.id}'s schedule</DialogTitle>
                                                        <DialogDescription className='hidden'>Doctor's schedule</DialogDescription>
                                                    </DialogHeader>

                                                    {scheduleLoading ? (
                                                        <p>Loading schedules...</p>
                                                    ) : scheduleData?.data && scheduleData.data.length > 0 ? (
                                                        <DoctorScheduleForm
                                                            refetch={refetch}
                                                            setSelectedStaffId={() => { }}
                                                            setOpenDialogId={setOpenDialogId}
                                                            // selectedStaffId={selectedStaffId}
                                                            scheduleData={schedule}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col justify-center items-center">
                                                            <InboxIcon className="w-8 h-8 text-muted-foreground" />
                                                            <p className="mt-2 font-medium text-lg">No results found</p>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog> */}
                                            <DoctorScheduleForm
                                                refetch={refetch}
                                                setSelectedStaffId={() => { }}
                                                // setOpenDialogId={setOpenDialogId}
                                                // selectedStaffId={selectedStaffId}
                                                scheduleData={schedule}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableBody>

                    {/* <TableBody>
                        {scheduleData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.patient_id}</TableCell>
                                <TableCell>{item.staff_id}</TableCell>
                                <TableCell>{formatDateTime(item.start_time)}</TableCell>
                                <TableCell>{formatDateTime(item.end_time)}</TableCell>
                                <TableCell>{item.purpose}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody> */}
                </Table>
            </div>
        </div>
    );
}
