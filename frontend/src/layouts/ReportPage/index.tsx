import PatientTreatmentTab from './PatientTreatmentTab';
import StaffJobChangeHistoryTab from './StaffJobChangeHistoryTab';
import DoctorWorkloadTab from './DoctorWorkloadTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContext } from '@/hooks/Auth/UserContext';
import { useContext } from 'react';

export default function ReportsPage() {
    const { user } = useContext(UserContext);

    return (
        <div className="mx-auto p-4 sm:p-6 container">
            <h1 className="mb-6 font-bold text-2xl">
                {user.job_type === 'Admin' ? 'Staff Job Change' : 'Hospital'} Reports
            </h1>

            {user.job_type === 'Admin' &&
                <StaffJobChangeHistoryTab />
            }

            {user.job_type != 'Admin' &&
                <Tabs defaultValue="patientTreatment" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="patientTreatment">Patient Treatment</TabsTrigger>
                        <TabsTrigger value="doctorWorkload">Doctor Workload</TabsTrigger>

                    </TabsList>
                    <TabsContent value="patientTreatment">
                        <PatientTreatmentTab />
                    </TabsContent>
                    <TabsContent value="doctorWorkload">
                        <DoctorWorkloadTab />
                    </TabsContent>
                </Tabs>
            }
        </div>
    );
}
