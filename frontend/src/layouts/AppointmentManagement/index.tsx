import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AppointmentTable from '@/components/AppointmentTable';
import { useDeleteWithoutTokenAPI } from '@/hooks/API/useDeleteAPI';
import { WorkingSchedule, WorkingScheduleResponse } from '@/types/appointment';
import AppointmentForm from '@/components/AppointmentForm';
export default function AppointmentManagement() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<number | null>(null);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState<number | null>(null);





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


    const { mutate: deleteAppointment } = useDeleteWithoutTokenAPI(`/api/appointment`, {
        onSuccess: () => {
            console.log('Appointment has been canceled.');
            refetch(); // To refresh the appointment data after deletion
        },
        onError: (error) => {
            console.error('Error deleting data', error);
        },
    });

    const cancelAppointment = (id: number | undefined) => {
        if (!id) return;
        deleteAppointment(`${id}`);
        setIsCancelDialogOpen(null);
    };


    const addNote = (id: number | undefined, note: string) => {
        console.log('Add note to appointment with id:', id, 'Note:', note);
        setIsNoteDialogOpen(null);
    };

    return (
        <div className="flex-1 p-6">
            <h1 className="mb-6 font-bold text-2xl">Appointment Management</h1>

            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <DatePickerWithRange
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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="p-0 w-8 h-8">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56">
                                    <div className="gap-4 grid">
                                        <Dialog open={isCancelDialogOpen === appointment.id} onOpenChange={() => setIsCancelDialogOpen(isCancelDialogOpen === appointment.id ? null : appointment.id)}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" className="justify-start w-full">
                                                    Cancel Appointment
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Cancel Appointment</DialogTitle>
                                                    <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(null)}>No</Button>
                                                    <Button onClick={() => cancelAppointment(appointment.id)}>Yes, Cancel</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>


                                        <Dialog open={isNoteDialogOpen === appointment.id} onOpenChange={() => setIsNoteDialogOpen(isNoteDialogOpen === appointment.id ? null : appointment.id)}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" className="justify-start w-full">
                                                    Add Note
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Appointment Note</DialogTitle>
                                                    <DialogDescription>Add a note for this appointment</DialogDescription>
                                                </DialogHeader>
                                                <form className="space-y-4" onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const form = e.target as HTMLFormElement;
                                                    const note = (form.elements.namedItem('note') as HTMLInputElement).value;
                                                    addNote(appointment.id, note);
                                                    form.reset();
                                                }}>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="note">Note</Label>
                                                        <Textarea id="note" name="note" placeholder="Enter appointment note" />
                                                    </div>
                                                    <Button type="submit">Add Note</Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </>
                    )}
                </AppointmentTable>
            </div>
        </div>
    );
}
