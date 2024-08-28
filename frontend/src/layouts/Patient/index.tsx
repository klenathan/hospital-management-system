import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search } from "lucide-react"
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI'
import { PatientResponse } from '@/types/patients'
import TableEmpty from '@/components/TableEmpty'
import { format } from 'date-fns'

import { Label } from '@/components/ui/label'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext,
} from '@/components/ui/pagination';

import AddPatientForm from '@/components/AddPatientForm'

export default function Patient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  // const { data: appointmentsData, isLoading: appointmentsDataLoading, refetch } =
  //   useQueryWithTokenAPI<WorkingScheduleResponse>(
  //     ['appointments', queryStartTime, queryEndTime],
  //     `/api/appointment/schedule?startTime=${encodeURIComponent(queryStartTime)}&endTime=${encodeURIComponent(queryEndTime)}`
  //   );

  // const { data: scheduleData, isLoading: scheduleLoading, refetch: refetchSchedule } = useQueryWithTokenAPI<ScheduleResponse>(
  //   ['schedule', selectedStaffId?.toString() || ''], selectedStaffId ? `/api/staff/schedule/${selectedStaffId}` : '/api/'
  // );

  const [searchID, setSearchID] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');


  const searchQuerry = () => {
    if (searchType === 'id') {
      setSearchID(searchTerm);
      setSearchName('');
    } else {
      setSearchID('');
      setSearchName(searchTerm);
    }

  }

  const getApiEndpoint = () => {
    if (searchID !== '') {
      return `/api/patient/id/${searchID}`;
    } else if (searchName !== '') {
      return `/api/patient/name/${searchName}`;
    } else {
      return '/api/patient/';
    }
  };

  const { data: patientsData, isLoading: patientsDataLoading, refetch } =
    useQueryWithTokenAPI<PatientResponse>(
      ['patient', searchID, searchName],
      getApiEndpoint()
    );


  const patientList = Array.isArray(patientsData?.data) ? patientsData.data : [];

  // Pagination logic
  const totalPages = Math.ceil(patientList.length / itemsPerPage);
  const paginatedPatients = patientList.slice(
    (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search type or term changes
    refetch(); // Refetch data when the criteria changes
  }, [searchType, searchTerm, refetch]);

  if (patientsDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="mb-6 font-bold text-2xl">Appointment Management</h1>

      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="id">ID</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={'outline'} onClick={() => searchQuerry()} >
          <Search className="mr-2 w-4 h-4" />
          Search
        </Button>
        <AddPatientForm />

      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Allergies</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPatients.length === 0 ? (
            // <TableRow>
            <TableEmpty colSpan={8} />
            // </TableRow>
          ) : (
            paginatedPatients.map((patient, index) => (
              <TableRow key={index}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.first_name}</TableCell>
                <TableCell>{patient.last_name}</TableCell>
                <TableCell>{format(new Date(patient.date_of_birth), "PPP")}</TableCell>
                <TableCell>{patient.contact_info}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.allergies}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="p-0 w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Patient Details</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="info">
                        <TabsList>
                          <TabsTrigger value="info">Info</TabsTrigger>
                          <TabsTrigger value="treatments">Treatments</TabsTrigger>
                          <TabsTrigger value="customObjects">Custom Objects</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info">
                          <Card>
                            <CardHeader>
                              <CardTitle>{patient.first_name + " " + patient.last_name}</CardTitle>
                              <CardDescription>Patient Information</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p>Date of Birth: {patient.date_of_birth}</p>
                              <p>Allergies: {patient.allergies}</p>
                              {/* <p>Gender: {patient.gender}</p> */}
                              <p>Address: {patient.address}</p>
                              <p>Contact: {patient.contact_info}</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        {/* <TabsContent value="treatments">
                          <Card>
                            <CardHeader>
                              <CardTitle>Treatments</CardTitle>
                              <CardDescription>Patient's treatment history</CardDescription>
                            </CardHeader>
                            <CardContent>
                              {patient.treatments && patient.treatments.map((treatment, index) => (
                                <div key={index} className="mb-2">
                                  <p>Date: {treatment.date}</p>
                                  <p>Doctor: {treatment.doctor}</p>
                                  <p>Description: {treatment.description}</p>
                                </div>
                              ))}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button>Add Treatment</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add New Treatment</DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={(e) => {
                                    e.preventDefault()
                                    const form = e.target
                                    addTreatment(patient.id, {
                                      date: form.date.value,
                                      doctor: form.doctor.value,
                                      description: form.description.value,
                                    })
                                  }}>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" name="date" type="date" required />
                                      </div>
                                      <div>
                                        <Label htmlFor="doctor">Doctor</Label>
                                        <Select name="doctor">
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select doctor" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {doctors.map(doctor => (
                                              <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" required />
                                      </div>
                                      <Button type="submit">Add Treatment</Button>
                                    </div>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            </CardContent>
                          </Card>
                        </TabsContent> */}
                        {/* <TabsContent value="customObjects">
                          <Card>
                            <CardHeader>
                              <CardTitle>Custom Objects</CardTitle>
                              <CardDescription>Notes, images, etc.</CardDescription>
                            </CardHeader>
                            <CardContent>
                              {patient.customObjects && patient.customObjects.map((object, index) => (
                                <div key={index} className="mb-2">
                                  <p>Type: {object.type}</p>
                                  <p>Content: {object.content}</p>
                                  <p>Staff: {object.staff}</p>
                                </div>
                              ))}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button>Add Custom Object</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Custom Object</DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={(e) => {
                                    e.preventDefault()
                                    const form = e.target
                                    addCustomObject(patient.id, {
                                      type: form.type.value,
                                      content: form.content.value,
                                      staff: form.staff.value,
                                    })
                                  }}>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select name="type">
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="note">Note</SelectItem>
                                            <SelectItem value="image">Image</SelectItem>
                                            <SelectItem value="document">Document</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea id="content" name="content" required />
                                      </div>
                                      <div>
                                        <Label htmlFor="staff">Staff</Label>
                                        <Input id="staff" name="staff" required />
                                      </div>
                                      <Button type="submit">Add Custom Object</Button>
                                    </div>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            </CardContent>
                          </Card>
                        </TabsContent> */}
                      </Tabs>
                      {/* <Button variant="destructive" onClick={() => deletePatient(patient.id)}>Delete Patient</Button>                     */}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={currentPage !== 1 ? () => setCurrentPage((prev) => Math.max(prev - 1, 1)) : () => { }}
            />
          </PaginationItem>

          {currentPage > 2 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === currentPage ||
              pageNumber === currentPage - 1 ||
              pageNumber === currentPage + 1
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                    className={pageNumber === currentPage ? 'active' : ''}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}
          z
          {currentPage < totalPages - 1 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={currentPage !== totalPages ? () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)) : () => { }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
