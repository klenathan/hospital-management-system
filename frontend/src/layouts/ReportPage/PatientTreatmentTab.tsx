import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { PatientResponse } from '@/types/patients';
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';
import { PatientTreatmentResponse } from '@/types/report';
import { format } from "date-fns";

export default function PatientTreatmentTab() {
    const [selectedPatient, setSelectedPatient] = useState<{ value: string; label: string } | null>({
        value: 'All Patients',
        label: 'All Patients',
    });

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const { data: patientsData, isLoading: patientsLoading } =
        useQueryWithoutTokenAPI<PatientResponse>(['patients'], '/api/patient/');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
        if (patientsLoading || !patientsData) return;

        const filteredPatients = patientsData.data
            .filter(patient =>
                `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 20) // Lazy loading the first 20 results
            .map(patient => ({
                value: patient.id.toString(),
                label: `${patient.first_name} ${patient.last_name}`,
            }));

        callback(filteredPatients);
    };

    const handlePatientChange = (newValue: unknown) => {
        const selectedOption = newValue as { value: string; label: string } | null;
        setSelectedPatient(selectedOption);
    };

    const getFormattedDate = (date?: Date) => {
        return date ? format(date, "yyyy-MM-dd HH:mm:ss") : '';
    };

    const queryStartTime = getFormattedDate(dateRange?.from);
    const queryEndTime = getFormattedDate(dateRange?.to);
    const patientID = selectedPatient?.value || 'All Patients';

    const { data: patientTreatementData, isLoading: patientTreatementDataLoading, refetch } =
        useQueryWithoutTokenAPI<PatientTreatmentResponse>(
            ['patientTreatment', patientID, queryStartTime, queryEndTime],
            patientID !== "All Patients"
                ? `/api/report/patientTreatmentHistory?patientId=${encodeURIComponent(patientID)}&startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
                : `/api/report/patientTreatmentHistory?startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
        );

    const generateReport = () => {
        refetch();  // Refetch the data when the user clicks "Generate Report"
    };

    return (
        <div className="space-y-4">
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
                <div>
                    <Label htmlFor="patient">Patient</Label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadOptions}
                        onChange={handlePatientChange}
                        isClearable
                        placeholder="Select patient..."
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
            <Button onClick={generateReport}>Generate Report</Button>
            {/* {selectedPatient?.label + '' + selectedPatient?.value} */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Staff</TableHead>
                        <TableHead>Staff Job Type</TableHead>
                        <TableHead>Treatment Date</TableHead>
                        <TableHead>Treatment Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patientTreatementDataLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                        </TableRow>
                    ) : (
                        patientTreatementData && patientTreatementData.data.map((treatment, index) => (
                            <TableRow key={index}>
                                <TableCell>{`${treatment.patient_first_name} ${treatment.patient_last_name}`}</TableCell>
                                <TableCell>{`${treatment.staff_first_name} ${treatment.staff_last_name}`}</TableCell>
                                <TableCell>{treatment.staff_job_type}</TableCell>
                                <TableCell>{format(new Date(treatment.treatment_date), "PPP")}</TableCell>
                                <TableCell>{treatment.treatment_details}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
