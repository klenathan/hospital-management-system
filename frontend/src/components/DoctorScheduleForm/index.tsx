// ScheduleForm.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2Icon, StickyNoteIcon, SquarePenIcon } from 'lucide-react';
import { DoctorSchedule } from '@/types/schedule';
import { useDeleteWithTokenAPI } from '@/hooks/API/useDeleteAPI';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { UpdateAppointmentForm } from '../UpdateAppointmentForm';
import AddCustomObjectForm from '../AddCustomObjectForm';
import BlobList from '../BlobList';

interface DoctorScheduleProps {
    setSelectedStaffId: (id: number | null) => void;
    scheduleData: DoctorSchedule;
    refetch: () => void;
}

export default function DoctorScheduleForm({
    setSelectedStaffId,
    scheduleData,
    refetch
}: DoctorScheduleProps) {

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
        refetch();
    };

    const startDate = new Date(scheduleData.start_time);
    const endDate = new Date(scheduleData.end_time);

    return (
        <div key={scheduleData.id} className="flex justify-center items-center gap-2 p-3 w-full">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button size="icon" className="w-10 h-10" onClick={() => { setSelectedAppointmentId(scheduleData.id); setIsOpen(true) }}>
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
                        appointmentId={scheduleData.id}
                        startDate={startDate}
                        endDate={endDate}
                        refetch={refetch}
                        onSuccess={() => {
                            setSelectedAppointmentId(null);
                            setIsOpen(false);
                            refetch();

                        }}
                        onCancel={() => {
                            setSelectedAppointmentId(null);
                            refetch()
                        }}
                        staffId={scheduleData.staff_id}
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
                    <BlobList domain='appointment' parent={scheduleData.id.toString()} />
                    <AddCustomObjectForm domain='appointment' parentID={scheduleData.id.toString()} />
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
                        <AlertDialogAction onClick={() => handleDelete(scheduleData.id)}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
