import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    scheduleData?: Schedule[]; // Now expecting an array of schedules
    scheduleLoading?: boolean; // Loading state for the schedule
}

export default function ScheduleForm({
    selectedStaffId,
    scheduleData = [], // Default to an empty array
    scheduleLoading = false,
}: ScheduleFormProps) {
    const [selectedScheduleIndex, setSelectedScheduleIndex] = useState<number>(0); // Track selected schedule index
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
        if (scheduleData.length > 0 && scheduleData[selectedScheduleIndex]) {
            // Initialize the schedule state with the selected schedule
            const scheduleItem = scheduleData[selectedScheduleIndex];
            const startDate = scheduleItem.start_time ? new Date(scheduleItem.start_time) : null;
            const endDate = scheduleItem.end_time ? new Date(scheduleItem.end_time) : null;

            setSchedule({
                id: scheduleItem.id,
                title: `${scheduleItem.first_name} ${scheduleItem.last_name}`, // Assuming title is the staff's name
                startDate: startDate ? startDate.toISOString().split('T')[0] : '',
                startTime: startDate ? startDate.toISOString().split('T')[1].slice(0, 5) : '',
                endDate: endDate ? endDate.toISOString().split('T')[0] : '',
                endTime: endDate ? endDate.toISOString().split('T')[1].slice(0, 5) : '',
                purpose: scheduleItem.purpose || '',
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
    }, [scheduleData, selectedScheduleIndex]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchedule((prev) => ({ ...prev, [name]: value }));
    };

    const handleScheduleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedScheduleIndex(Number(e.target.value));
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
        <>
            {scheduleLoading ? (
                <p>Loading schedule...</p>
            ) : (
                <form onSubmit={handleUpdateSchedule} className="gap-4 grid grid-cols-2 py-4">
                    {scheduleData.length > 1 && (
                        <div className="gap-2 grid col-span-2">

                            <Label htmlFor="scheduleSelection">Select Schedule</Label>
                            <select
                                id="scheduleSelection"
                                onChange={handleScheduleSelectionChange}
                                value={selectedScheduleIndex}
                                className="p-2 border rounded"
                            >
                                {scheduleData.map((scheduleItem, index) => {
                                    const date = new Date(scheduleItem.start_time);

                                    // Extract the date components manually
                                    const year = date.getUTCFullYear();
                                    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                                    const day = String(date.getUTCDate()).padStart(2, '0');
                                    const hours = String(date.getUTCHours()).padStart(2, '0');
                                    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

                                    // Format the date and time as 'yyyy-MM-dd HH:mm'
                                    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

                                    return (
                                        <option key={index} value={index}>
                                            {scheduleItem.purpose} - {formattedTime}
                                        </option>
                                    );
                                })}

                            </select>
                        </div>
                    )}
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
                    <div className="flex justify-start col-span-2">
                        <Button type="submit">{schedule.id ? 'Update' : 'Create'} Schedule</Button>
                    </div>
                </form>
            )}
        </>
    );
}
