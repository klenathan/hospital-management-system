import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { Schedule } from '@/types/schedule';


type ScheduleTest = {
    id?: number;
    purpose: string;
    start_time: string;
    end_time: string;
};

export default function ScheduleForm({ selectedStaffId }: { selectedStaffId: number | null }) {
    const [schedules, setSchedules] = useState<ScheduleTest[]>([]);
    const [newSchedule, setNewSchedule] = useState<ScheduleTest>({
        purpose: '',
        start_time: '',
        end_time: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSchedule((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSchedule = () => {
        const newId = schedules.length ? schedules[schedules.length - 1].id! + 1 : 1;
        const scheduleToAdd = { ...newSchedule, id: newId };
        setSchedules((prev) => [...prev, scheduleToAdd]);
        setNewSchedule({ purpose: '', start_time: '', end_time: '' });
    };

    const handleRemoveSchedule = (id: number) => {
        setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    };

    const handleUpdateSchedule = (id: number, updatedSchedule: ScheduleTest) => {
        setSchedules((prev) =>
            prev.map((schedule) => (schedule.id === id ? updatedSchedule : schedule))
        );
    };

    return (
        <TabsContent value="schedule">
            {schedules.length > 0 ? (
                <ul>
                    {schedules.map((schedule) => (
                        <li key={schedule.id}>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateSchedule(schedule.id!, schedule);
                                }}
                            >
                                <Input
                                    type="text"
                                    name="purpose"
                                    value={schedule.purpose}
                                    onChange={(e) =>
                                        setSchedules((prev) =>
                                            prev.map((s) =>
                                                s.id === schedule.id
                                                    ? { ...s, purpose: e.target.value }
                                                    : s
                                            )
                                        )
                                    }
                                />
                                <Input
                                    type="datetime-local"
                                    name="start_time"
                                    value={new Date(schedule.start_time).toISOString().slice(0, 16)}
                                    onChange={(e) =>
                                        setSchedules((prev) =>
                                            prev.map((s) =>
                                                s.id === schedule.id
                                                    ? { ...s, start_time: e.target.value }
                                                    : s
                                            )
                                        )
                                    }
                                />
                                <Input
                                    type="datetime-local"
                                    name="end_time"
                                    value={new Date(schedule.end_time).toISOString().slice(0, 16)}
                                    onChange={(e) =>
                                        setSchedules((prev) =>
                                            prev.map((s) =>
                                                s.id === schedule.id
                                                    ? { ...s, end_time: e.target.value }
                                                    : s
                                            )
                                        )
                                    }
                                />
                                <Button type="submit">Update</Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveSchedule(schedule.id!)}
                                >
                                    Remove
                                </Button>
                            </form>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No schedules found.</p>
            )}

            <h3>Add New Schedule</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddSchedule();
                }}
            >
                <Input
                    type="text"
                    name="purpose"
                    placeholder="Purpose"
                    value={newSchedule.purpose}
                    onChange={handleInputChange}
                />
                <Input
                    type="datetime-local"
                    name="start_time"
                    value={newSchedule.start_time}
                    onChange={handleInputChange}
                />
                <Input
                    type="datetime-local"
                    name="end_time"
                    value={newSchedule.end_time}
                    onChange={handleInputChange}
                />
                <Button type="submit">Add Schedule</Button>
            </form>
        </TabsContent>
    );
}
