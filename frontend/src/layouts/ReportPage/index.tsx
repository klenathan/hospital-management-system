import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReportsPage() {
    const [patientTreatmentHistory, setPatientTreatmentHistory] = useState([])
    const [generalPatientTreatment, setGeneralPatientTreatment] = useState([])
    const [staffJobChangeHistory, setStaffJobChangeHistory] = useState([])
    const [doctorWorkload, setDoctorWorkload] = useState([])
    const [allDoctorsWorkload, setAllDoctorsWorkload] = useState([])

    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

    // Mock data for demonstration
    const patients = ["John Doe", "Jane Smith", "Alice Johnson"]
    const doctors = ["Dr. Brown", "Dr. Davis", "Dr. Wilson"]
    const staff = ["Sarah Connor", "James Cameron", "Linda Hamilton"]

    const generateReport = (reportType: string) => {
        // In a real application, this would make an API call to fetch the report data
        // For this example, we'll just set some mock data
        switch (reportType) {
            case "patientTreatmentHistory":
                setPatientTreatmentHistory([
                    { date: "2023-06-01", treatment: "Checkup", doctor: "Dr. Brown" },
                    { date: "2023-06-15", treatment: "X-Ray", doctor: "Dr. Davis" },
                    { date: "2023-07-01", treatment: "Follow-up", doctor: "Dr. Brown" },
                ])
                break
            case "generalPatientTreatment":
                setGeneralPatientTreatment([
                    { patient: "John Doe", date: "2023-06-01", treatment: "Checkup" },
                    { patient: "Jane Smith", date: "2023-06-15", treatment: "X-Ray" },
                    { patient: "Alice Johnson", date: "2023-07-01", treatment: "Follow-up" },
                ])
                break
            case "staffJobChangeHistory":
                setStaffJobChangeHistory([
                    { date: "2022-01-01", position: "Junior Nurse", department: "ER" },
                    { date: "2022-06-01", position: "Senior Nurse", department: "ER" },
                    { date: "2023-01-01", position: "Head Nurse", department: "ICU" },
                ])
                break
            case "doctorWorkload":
                setDoctorWorkload([
                    { date: "2023-06-01", patients: 8, hours: 10 },
                    { date: "2023-06-02", patients: 6, hours: 9 },
                    { date: "2023-06-03", patients: 7, hours: 11 },
                ])
                break
            case "allDoctorsWorkload":
                setAllDoctorsWorkload([
                    { doctor: "Dr. Brown", patients: 45, hours: 50 },
                    { doctor: "Dr. Davis", patients: 40, hours: 48 },
                    { doctor: "Dr. Wilson", patients: 42, hours: 52 },
                ])
                break
        }
    }

    return (
        <div className="mx-auto p-4 sm:p-6 container">
            <h1 className="mb-6 font-bold text-2xl">Hospital Reports</h1>

            <Tabs defaultValue="patientTreatmentHistory" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="patientTreatmentHistory">Patient Treatment History</TabsTrigger>
                    <TabsTrigger value="generalPatientTreatment">General Patient Treatment</TabsTrigger>
                    <TabsTrigger value="staffJobChangeHistory">Staff Job Change History</TabsTrigger>
                    <TabsTrigger value="doctorWorkload">Doctor Workload</TabsTrigger>
                    <TabsTrigger value="allDoctorsWorkload">All Doctors' Workload</TabsTrigger>
                </TabsList>

                <TabsContent value="patientTreatmentHistory">
                    <div className="space-y-4">
                        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="patient">Patient</Label>
                                <Select>
                                    <SelectTrigger id="patient">
                                        <SelectValue placeholder="Select patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map(patient => (
                                            <SelectItem key={patient} value={patient}>{patient}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <div className="flex space-x-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start w-full font-normal text-left">
                                                <CalendarIcon className="mr-2 w-4 h-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto">
                                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start w-full font-normal text-left">
                                                <CalendarIcon className="mr-2 w-4 h-4" />
                                                {endDate ? format(endDate, "PPP") : <span>End date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto">
                                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => generateReport("patientTreatmentHistory")}>Generate Report</Button>
                        {patientTreatmentHistory.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Treatment</TableHead>
                                        <TableHead>Doctor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patientTreatmentHistory.map((treatment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{treatment.date}</TableCell>
                                            <TableCell>{treatment.treatment}</TableCell>
                                            <TableCell>{treatment.doctor}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="generalPatientTreatment">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <div className="flex space-x-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start w-full font-normal text-left">
                                            <CalendarIcon className="mr-2 w-4 h-4" />
                                            {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start w-full font-normal text-left">
                                            <CalendarIcon className="mr-2 w-4 h-4" />
                                            {endDate ? format(endDate, "PPP") : <span>End date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <Button onClick={() => generateReport("generalPatientTreatment")}>Generate Report</Button>
                        {generalPatientTreatment.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Treatment</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {generalPatientTreatment.map((treatment, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{treatment.patient}</TableCell>
                                            <TableCell>{treatment.date}</TableCell>
                                            <TableCell>{treatment.treatment}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="staffJobChangeHistory">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="staff">Staff Member</Label>
                            <Select>
                                <SelectTrigger id="staff">
                                    <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staff.map(member => (
                                        <SelectItem key={member} value={member}>{member}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => generateReport("staffJobChangeHistory")}>Generate Report</Button>
                        {staffJobChangeHistory.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Department</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {staffJobChangeHistory.map((change, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{change.date}</TableCell>
                                            <TableCell>{change.position}</TableCell>
                                            <TableCell>{change.department}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="doctorWorkload">
                    <div className="space-y-4">
                        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="doctor">Doctor</Label>
                                <Select>
                                    <SelectTrigger id="doctor">
                                        <SelectValue placeholder="Select doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map(doctor => (
                                            <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <div className="flex space-x-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start w-full font-normal text-left">
                                                <CalendarIcon className="mr-2 w-4 h-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto">
                                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start w-full font-normal text-left">
                                                <CalendarIcon className="mr-2 w-4 h-4" />
                                                {endDate ? format(endDate, "PPP") : <span>End date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto">
                                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => generateReport("doctorWorkload")}>Generate Report</Button>
                        {doctorWorkload.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Patients Seen</TableHead>
                                        <TableHead>Hours Worked</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doctorWorkload.map((workload, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{workload.date}</TableCell>
                                            <TableCell>{workload.patients}</TableCell>
                                            <TableCell>{workload.hours}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="allDoctorsWorkload">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <div className="flex space-x-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start w-full font-normal text-left">
                                            <CalendarIcon className="mr-2 w-4 h-4" />
                                            {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start w-full font-normal text-left">
                                            <CalendarIcon className="mr-2 w-4 h-4" />
                                            {endDate ? format(endDate, "PPP") : <span>End date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <Button onClick={() => generateReport("allDoctorsWorkload")}>Generate Report</Button>
                        {allDoctorsWorkload.length > 0 && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Doctor</TableHead>
                                        <TableHead>Patients Seen</TableHead>
                                        <TableHead>Hours Worked</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allDoctorsWorkload.map((workload, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{workload.doctor}</TableCell>
                                            <TableCell>{workload.patients}</TableCell>
                                            <TableCell>{workload.hours}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}