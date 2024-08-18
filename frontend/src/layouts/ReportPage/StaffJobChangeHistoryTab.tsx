import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StaffJobChangeHistoryTab() {
    const [staffJobChangeHistory, setStaffJobChangeHistory] = useState([]);

    const staff = ["Sarah Connor", "James Cameron", "Linda Hamilton"];

    const generateReport = () => {
        // Mock data for demonstration
        setStaffJobChangeHistory([
            { date: "2022-01-01", position: "Junior Nurse", department: "ER" },
            { date: "2022-06-01", position: "Senior Nurse", department: "ER" },
            { date: "2023-01-01", position: "Head Nurse", department: "ICU" },
        ]);
    };

    return (
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
            <Button onClick={generateReport}>Generate Report</Button>
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
    );
}
