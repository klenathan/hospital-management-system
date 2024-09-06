// ScheduleForm.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarIcon, ClockIcon, Trash2Icon, StickyNoteIcon, SquarePenIcon } from 'lucide-react';
import { Schedule } from '@/types/schedule';
import { useDeleteWithTokenAPI } from '@/hooks/API/useDeleteAPI';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { UpdateAppointmentForm } from '../UpdateAppointmentForm';
import AddCustomObjectForm from '../AddCustomObjectForm';
import BlobList from '../BlobList';
interface ScheduleFormProps {
    setSelectedStaffId: (id: number | null) => void;
    scheduleData: Schedule[];
    scheduleLoading?: boolean;
    refetch: () => void;
    setOpenDialogId: (id: number | null) => void;
}

export default function ScheduleForm({
    setOpenDialogId,
    setSelectedStaffId,
    scheduleData = [],
    scheduleLoading = false,
    refetch
}: ScheduleFormProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const { toast } = useToast();

    const deleteUserMutation = useDeleteWithTokenAPI<void>(`/api/appointment/${selectedAppointmentId}`, {
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Schedule has been deleted.",
            });
            setSelectedAppointmentId(null); // Reset after successful deletion
            setOpenDialogId(null);
            setSelectedStaffId(0);
            refetch();
        },
        onError: (error) => {
            console.error('Error submitting form:', error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
        },
    });

    const handleDelete = (appointmentId: number) => {
        setSelectedAppointmentId(appointmentId);
        deleteUserMutation.mutate();
    };

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
        <>
            {scheduleLoading ? (
                <p>Loading schedule...</p>
            ) : (
                <div className="-mr-6 pr-6 max-h-[60vh] overflow-y-auto">
                    <div className="gap-2 grid">
                        {scheduleData.map((schedule, index) => {
                            const startDate = new Date(schedule.start_time);
                            const endDate = new Date(schedule.end_time);

                            return (
                                <Card key={schedule.appointmentId + index} className="w-full">
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col flex-1 items-start text-muted-foreground">
                                                <h3 className="font-semibold text-black">{`${schedule.first_name} ${schedule.last_name}`}</h3>
                                                <div className='flex items-center'>
                                                    <CalendarIcon className="mr-1 w-3 h-3" />
                                                    {getFormattedDate(new Date(schedule.start_time)).split(' ')[0]} {/* Extract only the date */}
                                                    <ClockIcon className="mr-1 ml-2 w-3 h-3" />
                                                    {getFormattedDate(new Date(schedule.start_time)).split(' ')[1].slice(0, 5)} - {/* Extract and format the start time */}
                                                    {getFormattedDate(new Date(schedule.end_time)).split(' ')[1].slice(0, 5)} {/* Extract and format the end time */}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">

                                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button size="icon" className="w-10 h-10" onClick={() => { setSelectedAppointmentId(schedule.appointmentId); setIsOpen(false) }}>
                                                            <SquarePenIcon className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Update Appointment</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogDescription>
                                                            Fill out the form below to update the appointment.
                                                        </DialogDescription>
                                                        <UpdateAppointmentForm
                                                            appointmentId={schedule.appointmentId}
                                                            startDate={startDate}
                                                            endDate={endDate}
                                                            refetch={refetch}
                                                            onSuccess={() => {
                                                                setIsOpen(false);
                                                                setSelectedAppointmentId(null);
                                                                setOpenDialogId(null);
                                                                refetch();
                                                            }}
                                                            onCancel={() => {
                                                                setSelectedAppointmentId(null);
                                                                setOpenDialogId(null);
                                                            }}
                                                            staffId={schedule.id}
                                                        />
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="icon" className="w-10 h-10">
                                                            <StickyNoteIcon className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Add Note</DialogTitle>
                                                        </DialogHeader>
                                                        <BlobList domain='appointment' parent={schedule.id.toString()} />
                                                        <AddCustomObjectForm domain='appointment' parentID={schedule.id.toString()} />
                                                    </DialogContent>
                                                </Dialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="icon" className="w-10 h-10">
                                                            <Trash2Icon className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently cancel the schedule.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(schedule.appointmentId)}>
                                                                Confirm
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
