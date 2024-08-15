import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Appointment } from '@/types/appointment';
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { X, MoreHorizontal, Tag } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function AppointmentManagement() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<number | null>(null);
    const [isNoteDialogOpen, setIsNoteDialogOpen] = useState<number | null>(null);

    type AppointmentResponse = {
        queryResult: {
            count: number;
        };
        data: Appointment[];
    };

    const getFormattedDate = (date?: Date) => {
        return date ? format(date, "yyyy-MM-dd HH:mm:ss") : '';
    };

    const startTime = getFormattedDate(dateRange?.from);
    const endTime = getFormattedDate(dateRange?.to);

    const queryUrl = startTime && endTime
        ? `/api/appointment/schedule?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`
        : `/api/appointment/`;

    const { data: appointmentsData, isLoading: appointmentsDataLoading, refetch } =
        useQueryWithoutTokenAPI<AppointmentResponse>(
            ['appointments', startTime, endTime],
            queryUrl
        );

    console.log(appointmentsData);

    useEffect(() => {
        if (startTime && endTime) {
            refetch(); // Refetch appointments when date range changes
        }
    }, [startTime, endTime, refetch]);

    const cancelAppointment = (id: number | undefined) => {
        console.log('Cancel appointment with id:', id);
        setIsCancelDialogOpen(null); // Close the dialog after action
    }

    const addNote = (id: number | undefined, note: string) => {
        console.log('Add note to appointment with id:', id, 'Note:', note);
        setIsNoteDialogOpen(null); // Close the dialog after action
    }

    return (
        <div className="mx-auto p-4 sm:p-6 container">
            <h1 className="mb-6 font-bold text-2xl">Appointment Management</h1>

            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <DatePickerWithRange
                        className="w-full sm:w-auto"
                        selected={dateRange}
                        onSubmit={(range) => {
                            setDateRange(range);
                            // You can trigger a data fetch here based on the selected range
                            refetch();
                        }}
                    />
                    {(dateRange?.from || dateRange?.to) && (
                        <Button variant="ghost" onClick={() => {
                            setDateRange(undefined); refetch();
                        }} size="icon">
                            <X className="w-4 h-4" />
                            <span className="sr-only">Clear date filter</span>
                        </Button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {startTime && endTime ?
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Job Type</TableHead>
                                <TableHead>Qualifications</TableHead>
                                <TableHead>Department ID</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                            :
                            <TableRow>
                                <TableHead >Doctor</TableHead>
                                <TableHead >Patient</TableHead>
                                <TableHead >Date</TableHead>
                                <TableHead >Details</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        }
                    </TableHeader>
                    <TableBody>
                        {appointmentsDataLoading ? (
                            <TableRow>
                                {startTime && endTime ? (
                                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                                ) : (
                                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                                )}
                            </TableRow>
                        ) : (
                            appointmentsData?.data.map((appointment, index) => (
                                <TableRow key={index}>
                                    {startTime && endTime ? (
                                        <>
                                            <TableCell>{appointment.id}</TableCell>
                                            <TableCell>{appointment.first_name}</TableCell>
                                            <TableCell>{appointment.last_name}</TableCell>
                                            <TableCell>{appointment.job_type}</TableCell>
                                            <TableCell>{appointment.qualifications}</TableCell>
                                            <TableCell>{appointment.department_id}</TableCell>
                                            <TableCell>{appointment.salary}</TableCell>
                                            <TableCell>{appointment.busy ?
                                                <span className='bg-red-200 px-2 py-1 rounded-md text-red-800'>
                                                    <Tag className='inline-block mr-1 w-4 h-4' />
                                                    Busy
                                                </span>
                                                :
                                                <span className='bg-lime-200 px-2 py-1 rounded-md text-lime-800'>
                                                    <Tag className='inline-block mr-1 w-4 h-4' />
                                                    Available
                                                </span>
                                            }</TableCell>
                                            <TableCell>{appointment.treatment_details}</TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="font-medium">{appointment?.staff_first_name + ' ' + appointment?.staff_last_name + " (" + appointment?.staff_job_type + ")"} </TableCell>
                                            <TableCell>{appointment.patient_first_name + ' ' + appointment.patient_last_name}</TableCell>
                                            <TableCell>{appointment.treatment_date ? format(new Date(appointment.treatment_date), "PPP") : ''}</TableCell>
                                            <TableCell>{appointment.treatment_details}</TableCell>
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
                                                            <Dialog open={isCancelDialogOpen === index} onOpenChange={() => setIsCancelDialogOpen(isCancelDialogOpen === index ? null : index)}>
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

                                                            <Dialog open={isNoteDialogOpen === index} onOpenChange={() => setIsNoteDialogOpen(isNoteDialogOpen === index ? null : index)}>
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
                                                                        addNote(appointment?.id, form.note.value);
                                                                        form.reset();
                                                                    }}>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="note">Note</Label>
                                                                            <Textarea id="note" placeholder="Enter appointment note" />
                                                                        </div>
                                                                        <Button type="submit">Add Note</Button>
                                                                    </form>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
