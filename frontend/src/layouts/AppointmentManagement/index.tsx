import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { cn } from '@/lib/utils'

import { Check, ChevronsUpDown, CalendarIcon, MoreHorizontal, X } from "lucide-react"



export default function AppointmentManagement() {
    const [appointments, setAppointments] = useState([
        { id: 1, doctor: "Dr. Smith", patient: "John Doe", date: new Date(2023, 5, 15, 10, 0), status: "Scheduled" },
        { id: 2, doctor: "Dr. Johnson", patient: "Jane Smith", date: new Date(2023, 5, 16, 14, 30), status: "Scheduled" },
        { id: 3, doctor: "Dr. Williams", patient: "Bob Brown", date: new Date(2023, 5, 17, 11, 0), status: "Scheduled" },
        { id: 4, doctor: "Dr. Davis", patient: "Alice Green", date: new Date(2023, 5, 18, 9, 30), status: "Scheduled" },
    ])

    const [doctors] = useState([
        { id: 1, value: "dr_smith", label: "Dr. Smith" },
        { id: 2, value: "dr_johnson", label: "Dr. Johnson" },
        { id: 3, value: "dr_williams", label: "Dr. Williams" },
        { id: 4, value: "dr_davis", label: "Dr. Davis" },
    ])

    const [patients] = useState([
        { value: "john_doe", label: "John Doe" },
        { value: "jane_smith", label: "Jane Smith" },
        { value: "bob_brown", label: "Bob Brown" },
        { value: "alice_green", label: "Alice Green" },
    ]);

    const [selectedDoctor, setSelectedDoctor] = useState("")
    const [selectedPatient, setSelectedPatient] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [openDoctor, setOpenDoctor] = useState(false)
    const [openPatient, setOpenPatient] = useState(false)

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

    const clearDateFilter = () => {
        setStartDate(undefined)
        setEndDate(undefined)
    }

    const filteredAppointments = appointments.filter(apt => {
        if (!startDate || !endDate) return true
        return isWithinInterval(apt.date, { start: startOfDay(startDate), end: endOfDay(endDate) })
    })

    return (
        <div className="mx-auto p-4 sm:p-6 container">
            <h1 className="mb-6 font-bold text-2xl">Appointment Management</h1>

            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto">
                                <CalendarIcon className="mr-2 w-4 h-4" />
                                {startDate && endDate
                                    ? `${format(startDate, "PP")} - ${format(endDate, "PP")}`
                                    : "Select date range"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                            <div className="flex sm:flex-row flex-col">
                                <div className="p-2 sm:border-r border-b sm:border-b-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </div>
                                <div className="p-2">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {(startDate || endDate) && (
                        <Button variant="ghost" onClick={clearDateFilter} size="icon">
                            <X className="w-4 h-4" />
                            <span className="sr-only">Clear date filter</span>
                        </Button>
                    )}
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">Book Appointment</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Book Appointment</DialogTitle>
                            <DialogDescription>Select a doctor and date for your appointment</DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="doctor">Doctor</Label>
                                <Popover open={openDoctor} onOpenChange={setOpenDoctor}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openDoctor}
                                            className="justify-between w-full"
                                        >
                                            {selectedDoctor
                                                ? doctors.find((doctor) => doctor.value === selectedDoctor)?.label
                                                : "Select doctor..."}
                                            <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-full">
                                        <Command>
                                            <CommandInput placeholder="Search doctor..." />
                                            <CommandList>
                                                <CommandEmpty>No doctor found.</CommandEmpty>
                                                <CommandGroup>
                                                    {doctors.map((doctor) => (
                                                        <CommandItem
                                                            key={doctor.value}
                                                            value={doctor.value}
                                                            onSelect={(currentValue) => {
                                                                setSelectedDoctor(currentValue === selectedDoctor ? "" : currentValue)
                                                                setOpenDoctor(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedDoctor === doctor.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {doctor.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patient">Patient</Label>
                                <Popover open={openPatient} onOpenChange={setOpenPatient}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openPatient}
                                            className="justify-between w-full"
                                        >
                                            {selectedPatient
                                                ? patients.find((patient) => patient.value === selectedPatient)?.label
                                                : "Select patient..."}
                                            <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-full">
                                        <Command>
                                            <CommandInput placeholder="Search patient..." />
                                            <CommandList>
                                                <CommandEmpty>No patient found.</CommandEmpty>
                                                <CommandGroup>
                                                    {patients.map((patient) => (
                                                        <CommandItem
                                                            key={patient.value}
                                                            value={patient.value}
                                                            onSelect={(currentValue) => {
                                                                setSelectedPatient(currentValue === selectedPatient ? "" : currentValue)
                                                                setOpenPatient(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedPatient === patient.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {patient.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
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
                            <Button type="submit">Book Appointment</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Doctor</TableHead>
                            <TableHead className="w-[150px]">Patient</TableHead>
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.map(appointment => (
                            <TableRow key={appointment.id}>
                                <TableCell className="font-medium">{appointment.doctor}</TableCell>
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
        </div>
    )
}
