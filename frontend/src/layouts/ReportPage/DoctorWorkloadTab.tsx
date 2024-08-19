// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { DatePickerWithRange } from "@/components/DatePickerWithRange";
// import { DateRange } from "react-day-picker";

export default function DoctorWorkloadTab() {
    // const [doctorWorkload, setDoctorWorkload] = useState([]);
    // const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
    // const [selectedDoctor, setSelectedDoctor] = useState<string>("All Doctors");

    // const doctors = ["All Doctors", "Dr. Brown", "Dr. Davis", "Dr. Wilson"];

    // const generateReport = () => {
    //     // Mock data for demonstration
    //     if (selectedDoctor === "All Doctors") {
    //         setDoctorWorkload([
    //             { doctor: "Dr. Brown", patients: 45, hours: 50 },
    //             { doctor: "Dr. Davis", patients: 40, hours: 48 },
    //             { doctor: "Dr. Wilson", patients: 42, hours: 52 },
    //         ]);
    //     } else {
    //         setDoctorWorkload([
    //             { date: "2023-06-01", patients: 8, hours: 10 },
    //             { date: "2023-06-02", patients: 6, hours: 9 },
    //             { date: "2023-06-03", patients: 7, hours: 11 },
    //         ]);
    //     }
    // };

    return (
        <>
            Doctor Workload Tab
        </>
        // <div className="space-y-4">
        //     <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        //         <div>
        //             <Label htmlFor="doctor">Doctor</Label>
        //             <Select onValueChange={setSelectedDoctor} defaultValue="All Doctors">
        //                 <SelectTrigger id="doctor">
        //                     <SelectValue placeholder="Select doctor" />
        //                 </SelectTrigger>
        //                 <SelectContent>
        //                     {doctors.map(doctor => (
        //                         <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
        //                     ))}
        //                 </SelectContent>
        //             </Select>
        //         </div>
        //         <div className="col-span-2">
        //             <Label>Date Range</Label>
        //             <DatePickerWithRange
        //                 className="w-full"
        //                 onDateChange={setSelectedDateRange}
        //             />
        //         </div>
        //     </div>
        //     <Button onClick={generateReport}>Generate Report</Button>
        //     {doctorWorkload.length > 0 && (
        //         <Table>
        //             <TableHeader>
        //                 <TableRow>
        //                     {selectedDoctor === "All Doctors" ? <TableHead>Doctor</TableHead> : <TableHead>Date</TableHead>}
        //                     <TableHead>Patients Seen</TableHead>
        //                     <TableHead>Hours Worked</TableHead>
        //                 </TableRow>
        //             </TableHeader>
        //             <TableBody>
        //                 {doctorWorkload.map((workload, index) => (
        //                     <TableRow key={index}>
        //                         <TableCell>{workload.doctor || workload.date}</TableCell>
        //                         <TableCell>{workload.patients}</TableCell>
        //                         <TableCell>{workload.hours}</TableCell>
        //                     </TableRow>
        //                 ))}
        //             </TableBody>
        //         </Table>
        //     )}
        // </div>
    );
}
