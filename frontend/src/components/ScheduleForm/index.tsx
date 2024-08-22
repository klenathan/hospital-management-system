import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarIcon, ClockIcon, Trash2Icon, NotebookPen } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Schedule } from '@/types/schedule';
import { useDeleteWithTokenAPI } from '@/hooks/API/useDeleteAPI';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
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

    const [selectedAppoimentId, setSelectedAppoimentId] = useState<number | null>(null);

    const { toast } = useToast();

    const deleteUserMutation = useDeleteWithTokenAPI<void>(`/api/appointment/${selectedAppoimentId}`, {
        onSuccess: () => {
            console.log('Schedule has been deleted.');
            toast({
                variant: "success",
                title: "Schedule has been deleted.",
                // description: `${response}`,
            });
            setSelectedAppoimentId(null); // Reset after successful deletion
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

    const handleDelete = (appoimentId: number) => {
        setSelectedAppoimentId(appoimentId);
        deleteUserMutation.mutate();
    };

    const [note, setNote] = useState('');

    const handleAddNote = () => {
        console.log(`Note added: ${note}`);
        // Implement logic to add note
    };

    return (
        <>
            {scheduleLoading ? (
                <p>Loading schedule...</p>
            ) : (
                <div className="-mr-6 pr-6 max-h-[60vh] overflow-y-auto">
                    <div className="gap-2 grid">
                        {scheduleData.map((schedule) => {
                            const startDate = new Date(schedule.start_time);
                            const endDate = new Date(schedule.end_time);

                            return (
                                <Card key={schedule.appoimentId} className="w-full">
                                    <CardContent className="p-3">
                                        {/* {schedule.appoimentId} */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col flex-1 items-start text-muted-foreground">
                                                <h3 className="font-semibold text-black">{`${schedule.first_name} ${schedule.last_name}`}</h3>
                                                <div className='flex items-center'>
                                                    <CalendarIcon className="mr-1 w-3 h-3" />
                                                    {startDate.toISOString().split('T')[0]}
                                                    <ClockIcon className="mr-1 ml-2 w-3 h-3" />
                                                    {startDate.toISOString().split('T')[1].slice(0, 5)} - {endDate.toISOString().split('T')[1].slice(0, 5)}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="icon" className="w-10 h-10">
                                                            <NotebookPen className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Add Note</DialogTitle>
                                                        </DialogHeader>
                                                        <Input
                                                            placeholder="Enter your note here"
                                                            value={note}
                                                            onChange={(e) => setNote(e.target.value)}
                                                        />
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button type="button" variant="secondary">
                                                                    Cancel
                                                                </Button>
                                                            </DialogClose>
                                                            <Button type="button" onClick={handleAddNote}>
                                                                Add Note
                                                            </Button>
                                                        </DialogFooter>
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
                                                            <AlertDialogAction onClick={() => handleDelete(schedule.appoimentId)}>
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
