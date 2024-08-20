import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';
import { DateTimePickerWithRange } from '@/components/DateTimePickerWithRange';
import { DateRange } from 'react-day-picker';
import { MoreHorizontal } from 'lucide-react';
import AppointmentTable from '@/components/AppointmentTable';
// import { useDeleteWithoutTokenAPI } from '@/hooks/API/useDeleteAPI';
import { WorkingSchedule, WorkingScheduleResponse } from '@/types/appointment';
import AppointmentForm from '@/components/AppointmentForm';
import { ScheduleResponse } from '@/types/schedule';
import ScheduleForm from '@/components/ScheduleForm';


export default function AppointmentManagement() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });


    const getFormattedDate = (date?: Date) => {
        return date ? format(date, "yyyy-MM-dd HH:mm:ss") : '';
    };

    const queryStartTime = getFormattedDate(dateRange?.from);
    const queryEndTime = getFormattedDate(dateRange?.to);

    const { data: appointmentsData, isLoading: appointmentsDataLoading, refetch } =
        useQueryWithoutTokenAPI<WorkingScheduleResponse>(
            ['appointments', queryStartTime, queryEndTime],
            `/api/appointment/schedule?startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
        );

    useEffect(() => {
        if (queryStartTime && queryEndTime) {
            refetch();
        }
    }, [queryStartTime, queryEndTime, refetch]);


    // const { mutate: deleteAppointment } = useDeleteWithoutTokenAPI(`/api/appointment`, {
    //     onSuccess: () => {
    //         console.log('Appointment has been canceled.');
    //         refetch(); // To refresh the appointment data after deletion
    //     },
    //     onError: (error) => {
    //         console.error('Error deleting data', error);
    //     },
    // });

    // const cancelAppointment = (id: number | undefined) => {
    //     if (!id) return;
    //     deleteAppointment(`${id}`);
    //     setIsCancelDialogOpen(null);
    // };

    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);


    const { data: scheduleData, isLoading: scheduleLoading } = useQueryWithoutTokenAPI<ScheduleResponse>(
        ['schedule', selectedStaffId?.toString() || ''], selectedStaffId ? `/api/staff/schedule/${selectedStaffId}` : '/api/'
    );
    return (
        <div className="flex-1 p-6">
            <h1 className="mb-6 font-bold text-2xl">Appointment Management</h1>

            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <DateTimePickerWithRange
                        className="w-full sm:w-auto"
                        selected={dateRange}
                        onSubmit={(range) => {
                            setDateRange(range);
                            refetch();
                        }}
                    />
                    {/* {(dateRange?.from || dateRange?.to) && (
                        <Button variant="ghost" onClick={() => { setDateRange(undefined); refetch(); }} size="icon">
                            <X className="w-4 h-4" />
                            <span className="sr-only">Clear date filter</span>
                        </Button>
                    )} */}
                </div>
                <AppointmentForm />
            </div>

            <div className="overflow-x-auto">
                <AppointmentTable appointmentData={appointmentsData?.data || []} isLoading={appointmentsDataLoading}>
                    {(appointment: WorkingSchedule) => (
                        <>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        className='p-0 w-8 h-8'
                                        onClick={() => setSelectedStaffId(appointment.id)}
                                    >
                                        <span className='sr-only'>Open menu</span>
                                        <MoreHorizontal className='w-4 h-4' />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-3xl'>
                                    <DialogHeader>
                                        <DialogTitle>{appointment.first_name + " " + appointment.last_name}'s schedule</DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>

                                    {scheduleLoading ? (
                                        <p>Loading schedules...</p>
                                    ) : scheduleData?.data && scheduleData.data.length > 0 ? (
                                        <ScheduleForm
                                            selectedStaffId={selectedStaffId}
                                            scheduleData={scheduleData.data}
                                            scheduleLoading={scheduleLoading}
                                        />
                                    ) : (
                                        <ScheduleForm
                                            selectedStaffId={selectedStaffId}
                                            scheduleLoading={scheduleLoading}
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </AppointmentTable>
            </div>
        </div>
    );
}
