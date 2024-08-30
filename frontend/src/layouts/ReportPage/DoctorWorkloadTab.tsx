import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import { StaffListResponse } from '@/types/staffs';
import { DoctorWorkHistoryResponse } from '@/types/report';
import { format } from 'date-fns';
import TableEmpty from '@/components/TableEmpty';

export default function DoctorWorkloadTab() {
    const [selectedDoctor, setSelectedDoctor] = useState<{ value: string; label: string } | null>(null);

    const { data: doctorsListData, isLoading: doctorsLoading } =
        useQueryWithTokenAPI<StaffListResponse>(
            ['doctor'],
            '/api/staff/doctors/'
        );

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const getFormattedDate = (date?: Date) => {
        return date ? format(date, "yyyy-MM-dd HH:mm:ss") : '';
    };

    const queryStartTime = getFormattedDate(dateRange?.from);
    const queryEndTime = getFormattedDate(dateRange?.to);



    const { data: doctorWorkHistoryData, isLoading: doctorWorkHistoryDataLoading } =
        useQueryWithTokenAPI<DoctorWorkHistoryResponse>(
            ['doctorWorkHistory', selectedDoctor?.value || "", queryStartTime, queryEndTime],
            selectedDoctor?.value !== "All Doctors"
                ? `/api/report/doctorWorkHistory?staffId=${encodeURIComponent(selectedDoctor?.value || "")}&startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
                : `/api/report/doctorWorkHistory?startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
        );



    const loadDoctorOptions = (inputValue: string, callback: (options: { value: string, label: string }[]) => void) => {
        if (doctorsLoading || !doctorsListData) return;

        const filteredDoctors = doctorsListData.data
            .filter(doctor =>
                `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 20) // Lazy loading the first 20 results
            .map(doctor => ({
                value: doctor.id.toString(),
                label: `${doctor.first_name} ${doctor.last_name}`,
            }));

        callback(filteredDoctors);
    };

    const handleDoctorChange = (selectedOption: { value: string; label: string } | null) => {
        setSelectedDoctor(selectedOption);
    };

    return (
        <div className="space-y-4">
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
                <div>
                    <Label htmlFor="doctor">Doctor</Label>
                    <AsyncSelect
                        id="doctor"
                        cacheOptions
                        loadOptions={loadDoctorOptions}
                        defaultOptions
                        onChange={handleDoctorChange}
                        value={selectedDoctor}
                        placeholder="Select doctor"
                        isClearable
                    />
                </div>
                <div className="col-span-2">
                    <Label>Date Range</Label>
                    <DatePickerWithRange
                        className="w-full"
                        selected={dateRange}
                        onSubmit={(range) => {
                            setDateRange(range);
                        }}
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Job Type</TableHead>
                        <TableHead>Appointment</TableHead>
                        <TableHead>Treatment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {doctorWorkHistoryDataLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) :
                        <>
                            {doctorWorkHistoryData?.queryResult.count === 0 ?
                                <>
                                    <TableEmpty colSpan={5} />
                                </> :

                                doctorWorkHistoryData && doctorWorkHistoryData.data.map((work, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{work.first_name}</TableCell>
                                        <TableCell>{work.last_name}</TableCell>
                                        <TableCell>{work.job_type}</TableCell>
                                        <TableCell>{work.appointment_nums}</TableCell>
                                        <TableCell>{work.treatment_nums}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </>
                    }
                </TableBody>
            </Table>
        </div>
    );
}
