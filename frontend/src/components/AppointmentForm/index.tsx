import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// Define the zod schema for validation
const appointmentSchema = z.object({
    doctor: z.string().min(1, "Please select a doctor."),
    patient: z.string().min(1, "Please select a patient."),
    date: z.string().min(1, "Please select a date."),
    startTime: z.string().min(1, "Please select a start time."),
    endTime: z.string().min(1, "Please select an end time."),
    purpose: z.string().min(1, "Please enter the purpose of the appointment."),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function AppointmentForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
    });

    const doctors = [
        { id: 1, name: "Dr. Smith" },
        { id: 2, name: "Dr. Johnson" },
        { id: 3, name: "Dr. Williams" },
        { id: 4, name: "Dr. Davis" },
    ];

    const patients = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Bob Brown" },
        { id: 4, name: "Alice Green" },
    ];

    const onSubmit = (data: AppointmentFormValues) => {
        console.log("Form data submitted:", data);
        // Call your API here with the form data
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Book Appointment</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        Select a doctor, patient, date, and purpose for your appointment
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="doctor">Doctor</Label>
                        <select
                            id="doctor"
                            className="p-2 border rounded w-full"
                            {...register("doctor")}
                        >
                            <option value="" disabled>
                                Select a doctor...
                            </option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id.toString()}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                        {errors.doctor && (
                            <p className="text-red-500">{errors.doctor.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="patient">Patient</Label>
                        <select
                            id="patient"
                            className="p-2 border rounded w-full"
                            {...register("patient")}
                        >
                            <option value="" disabled>
                                Select a patient...
                            </option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id.toString()}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                        {errors.patient && (
                            <p className="text-red-500">{errors.patient.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register("date")}
                            className="p-2 border rounded w-full"
                        />
                        {errors.date && (
                            <p className="text-red-500">{errors.date.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                            id="startTime"
                            type="time"
                            {...register("startTime")}
                            className="p-2 border rounded w-full"
                        />
                        {errors.startTime && (
                            <p className="text-red-500">{errors.startTime.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                            id="endTime"
                            type="time"
                            {...register("endTime")}
                            className="p-2 border rounded w-full"
                        />
                        {errors.endTime && (
                            <p className="text-red-500">{errors.endTime.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Textarea
                            id="purpose"
                            placeholder="Enter the purpose of the appointment"
                            {...register("purpose")}
                            className="p-2 border rounded w-full"
                        />
                        {errors.purpose && (
                            <p className="text-red-500">{errors.purpose.message}</p>
                        )}
                    </div>

                    <Button type="submit">Book Appointment</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
