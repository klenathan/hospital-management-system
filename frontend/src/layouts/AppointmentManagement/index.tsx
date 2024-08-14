import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MoreHorizontal, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function AppointmentManagement() {
    const [appointments, setAppointments] = useState([
        { id: 1, doctor: "Dr. Smith", patient: "John Doe", date: new Date(2023, 5, 15, 10, 0), status: "Scheduled" },
        { id: 2, doctor: "Dr. Johnson", patient: "Jane Smith", date: new Date(2023, 5, 16, 14, 30), status: "Scheduled" },
        // Add more mock appointments as needed
    ])

    const [doctors] = useState([
        { id: 1, name: "Dr. Smith", schedule: "Mon-Fri 9AM-5PM" },
        { id: 2, name: "Dr. Johnson", schedule: "Tue-Sat 10AM-6PM" },
        // Add more mock doctors as needed
    ])

    const [selectedDate, setSelectedDate] = useState<Date>()

    const cancelAppointment = (id: number) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status: "Cancelled" } : apt
        ))
    }

    const addNote = (id: number, note: string) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, note } : apt
        ))
    }

    return (
        <div className="mx-auto p-6 container">
            <h1 className="mb-6 font-bold text-2xl">Appointment Management</h1>

            <div className="flex justify-between items-center mb-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>View Doctor Schedules</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Doctor Schedules</DialogTitle>
                        </DialogHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Schedule</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {doctors.map(doctor => (
                                    <TableRow key={doctor.id}>
                                        <TableCell>{doctor.name}</TableCell>
                                        <TableCell>{doctor.schedule}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Book Appointment</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Book Appointment</DialogTitle>
                            <DialogDescription>Select a doctor and date for your appointment</DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="doctor">Doctor</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map(doctor => (
                                            <SelectItem key={doctor.id} value={doctor.id.toString()}>{doctor.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}>
                                            <CalendarIcon className="mr-2 w-4 h-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patient">Patient Name</Label>
                                <Input id="patient" placeholder="Enter patient name" />
                            </div>
                            <Button type="submit">Book Appointment</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map(appointment => (
                        <TableRow key={appointment.id}>
                            <TableCell>{appointment.doctor}</TableCell>
                            <TableCell>{appointment.patient}</TableCell>
                            <TableCell>{format(appointment.date, "PPP")}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
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
                                            <Dialog>
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
                                                        <Button variant="outline" onClick={() => { }}>No</Button>
                                                        <Button onClick={() => cancelAppointment(appointment.id)}>Yes, Cancel</Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
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
                                                        addNote(appointment.id, form.note.value);
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}