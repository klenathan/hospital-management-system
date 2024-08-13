import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Users, UserPlus, Calendar, BarChart } from "lucide-react"

export default function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="mb-6 font-bold text-3xl">Healthcare Management Dashboard</h1>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Management</CardTitle>
                        <CardDescription>Manage patient records and information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Users className="mb-4 w-12 h-12 text-primary" />
                        <a href="/patients">
                            <Button className="w-full">Patient Management</Button>
                        </a>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Staff Management</CardTitle>
                        <CardDescription>Manage healthcare staff and personnel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserPlus className="mb-4 w-12 h-12 text-primary" />
                        <a href="/staff">
                            <Button className="w-full">Staff Management</Button>
                        </a>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Management</CardTitle>
                        <CardDescription>Schedule and manage appointments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Calendar className="mb-4 w-12 h-12 text-primary" />
                        <a href="/appointments">
                            <Button className="w-full">Appointment Management</Button>
                        </a>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Reporting</CardTitle>
                        <CardDescription>Generate and view healthcare reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart className="mb-4 w-12 h-12 text-primary" />
                        <a href="/reports">
                            <Button className="w-full">Reporting</Button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}