import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Label } from "@/components/ui/label";
import { Schedule } from '@/types/schedule';

type ScheduleTest = {
    id?: number;
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    purpose: string;
};

interface ScheduleFormProps {
    selectedStaffId: number | null;
    scheduleData?: Schedule;
    scheduleLoading?: boolean; // Loading state for the schedule
}

export default function ScheduleForm({
    selectedStaffId,
    scheduleData,
    scheduleLoading = false,
}: ScheduleFormProps) {
    const [schedule, setSchedule] = useState<ScheduleTest>({
        id: undefined,
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        purpose: '',
    });

    useEffect(() => {
        if (scheduleData) {
            // Initialize the schedule state with the passed scheduleData
            const startDate = scheduleData.start_time ? new Date(scheduleData.start_time) : null;
            const endDate = scheduleData.end_time ? new Date(scheduleData.end_time) : null;

            setSchedule({
                id: scheduleData.id,
                title: `${scheduleData.first_name} ${scheduleData.last_name}`, // Assuming title is the staff's name
                startDate: startDate ? startDate.toISOString().split('T')[0] : '',
                startTime: startDate ? startDate.toISOString().split('T')[1].slice(0, 5) : '',
                endDate: endDate ? endDate.toISOString().split('T')[0] : '',
                endTime: endDate ? endDate.toISOString().split('T')[1].slice(0, 5) : '',
                purpose: scheduleData.purpose || '',
            });
        } else {
            // Reset the schedule to blank for creating a new schedule
            setSchedule({
                id: undefined,
                title: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                purpose: '',
            });
        }
    }, [scheduleData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchedule((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSchedule = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!schedule.purpose || !schedule.startDate || !schedule.startTime || !schedule.endDate || !schedule.endTime) {
            alert('All fields are required.');
            return;
        }

        const updatedSchedule = {
            purpose: schedule.purpose,
            start_time: new Date(`${schedule.startDate}T${schedule.startTime}`).toISOString(),
            end_time: new Date(`${schedule.endDate}T${schedule.endTime}`).toISOString(),
        };

        // Handle the logic to save the updated schedule
        console.log('id:', selectedStaffId, 'Updated Schedule:', updatedSchedule);
        // For example, you could make an API call here to save the updated schedule
    };

    return (
        <TabsContent value="schedule">
            {scheduleLoading ? (
                <p>Loading schedule...</p>
            ) : (
                <form onSubmit={handleUpdateSchedule} className="gap-4 grid grid-col-2 py-4">
                    <div className="gap-2 grid col-span-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Input
                            id="purpose"
                            name="purpose"
                            value={schedule.purpose}
                            onChange={handleInputChange}
                            placeholder="Enter the purpose"
                            required
                        />
                    </div>
                    <div className="gap-2 grid">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={schedule.startDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="gap-2 grid">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                            id="startTime"
                            name="startTime"
                            type="time"
                            value={schedule.startTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="gap-2 grid">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={schedule.endDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="gap-2 grid">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                            id="endTime"
                            name="endTime"
                            type="time"
                            value={schedule.endTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='flex justify-start grid-col-2'>
                        <Button type="submit">{scheduleData ? 'Update' : 'Create'} Schedule</Button>
                    </div>
                </form>
            )}
        </TabsContent>
    );
}
