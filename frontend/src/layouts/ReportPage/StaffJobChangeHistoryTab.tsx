// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { StaffJobChangeHistoryResponse } from '@/types/report';
// import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';


export default function StaffJobChangeHistoryTab() {
    // const [selectedStaff, setSelectedStaff] = useState<{ value: string; label: string } | null>({
    //     value: '',
    //     label: '',
    // });

    // const { data: staffListData, isLoading: staffLoading, refetch } =
    //     useQueryWithoutTokenAPI<StaffListResponse>(
    //         ['staff', selectedDepartment.toString()], selectedDepartment === 'all'
    //         ? '/api/staff/'
    //         : `/api/staff/department/${selectedDepartment}`
    //     );

    // // {
    // //     "queryResult": {
    // //         "count": 161
    // //     },
    // //     "data": [
    // //         {
    // //             "id": 200,
    // //             "first_name": "Abraham",
    // //             "last_name": "Crooks",
    // //             "job_type": "Doctor",
    // //             "qualifications": "Qualification Type 1",
    // //             "department_id": 3,
    // //             "salary": "46000000.00",
    // //             "deleted": 0,
    // //             "created_at": "2024-08-15T00:22:35.000Z",
    // //             "updated_at": "2024-08-15T00:22:35.000Z"
    // //         },




    // const { data: staffHistoryData, isLoading: staffHistoryDataLoading } =
    //     useQueryWithoutTokenAPI<StaffJobChangeHistoryResponse>(
    //         ['staffHistory', staffID],
    //         staffID !== ""
    //         && `/api/report/jobHistory/${staffID}`
    //     );

    // // Request URL
    // //     http://localhost:3000/api/report/jobHistory/1
    // // Server response
    // // Code	Details
    // //     200	
    // // Response body
    // //     Download
    // //     {
    // //         "queryResult": {
    // //             "count": 1
    // //         },
    // //         "data": [
    // //             {
    // //                 "id": 1,
    // //                 "staff_id": 1,
    // //                 "job_type": "Cardiologist",
    // //                 "salary": "40000000.00",
    // //                 "department_id": 1,
    // //                 "deleted": 0,
    // //                 "created_at": "2019-01-05T17:00:00.000Z",
    // //                 "updated_at": "2024-08-15T01:48:06.000Z"
    // //             }
    // //         ]
    // //     }



    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
    //     if (staffListLoading || !staffListData) return;

    //     const filteredstaffList = staffListData.data
    //         .filter(staff =>
    //             `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(inputValue.toLowerCase())
    //         )
    //         .slice(0, 20) // Lazy loading the first 20 results
    //         .map(staff => ({
    //             value: staff.id.toString(),
    //             label: `${staff.first_name} ${staff.last_name}`,
    //         }));

    //     callback(filteredstaffList);
    // };

    return (
        <>
            Staff Job history
        </>
        // <div className="space-y-4">
        //     <div>
        //         <Label htmlFor="staff">Staff Member</Label>
        //         <Select>
        //             <SelectTrigger id="staff">
        //                 <SelectValue placeholder="Select staff member" />
        //             </SelectTrigger>
        //             <SelectContent>
        //                 {staff.map(member => (
        //                     <SelectItem key={member} value={member}>{member}</SelectItem>
        //                 ))}
        //             </SelectContent>
        //         </Select>
        //     </div>
        //     <Button onClick={generateReport}>Generate Report</Button>
        //     {staffHistoryData.length > 0 && (
        //         <Table>
        //             <TableHeader>
        //                 <TableRow>
        //                     <TableHead>ID</TableHead>
        //                     <TableHead>STaffID</TableHead>
        //                     <TableHead>Staff Name</TableHead>
        //                     <TableHead>job_type</TableHead>
        //                     <TableHead>salary</TableHead>
        //                     <TableHead>department_id</TableHead>
        //                 </TableRow>
        //             </TableHeader>
        //             <TableBody>
        //                 {staffHistoryData?.map((change, index) => (
        //                     <TableRow key={index}>
        //                         <TableCell>{change.id}</TableCell>
        //                         <TableCell>{change.staff_id}</TableCell>
        //                         <TableCell>Selected staff name</TableCell>
        //                         <TableCell>{change.job_type}</TableCell>
        //                         <TableCell>{change.salary}</TableCell>
        //                         <TableCell>{change.department_id}</TableCell>
        //                     </TableRow>
        //                 ))}
        //             </TableBody>
        //         </Table>
        //     )}
        // </div>
    );
}
