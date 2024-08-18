import PatientTreatmentTab from './PatientTreatmentTab';
import StaffJobChangeHistoryTab from './StaffJobChangeHistoryTab';
import DoctorWorkloadTab from './DoctorWorkloadTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsPage() {
    return (
        <div className="mx-auto p-4 sm:p-6 container">
            <h1 className="mb-6 font-bold text-2xl">Hospital Reports</h1>

            <Tabs defaultValue="patientTreatment" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="patientTreatment">Patient Treatment</TabsTrigger>
                    <TabsTrigger value="staffJobChangeHistory">Staff Job Change History</TabsTrigger>
                    <TabsTrigger value="doctorWorkload">Doctor Workload</TabsTrigger>
                </TabsList>

                <TabsContent value="patientTreatment">
                    <PatientTreatmentTab />
                </TabsContent>

                <TabsContent value="staffJobChangeHistory">
                    <StaffJobChangeHistoryTab />
                </TabsContent>

                <TabsContent value="doctorWorkload">
                    <DoctorWorkloadTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
