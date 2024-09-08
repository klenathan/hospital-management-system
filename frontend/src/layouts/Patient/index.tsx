import { useState, useEffect, useContext } from 'react'; import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Search, ArrowDownUp } from "lucide-react";
import { useQueryWithTokenAPI } from '@/hooks/API/useQueryAPI';
import { PatientResponse } from '@/types/patients';
import TableEmpty from '@/components/TableEmpty';
import { format } from 'date-fns';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLast, PaginationFirst,
} from '@/components/ui/pagination';

import RegisterPatientForm from '@/components/RegisterPatientForm';
import BlobList from '@/components/BlobList';
import AddCustomObjectForm from '@/components/AddCustomObjectForm';
import { UpdatePatientInfoForm } from '@/components/UpdatePatientInfo';
import { AddTreatmentForm } from '@/components/AddTreatmentForm';
import { UserContext } from '@/hooks/Auth/UserContext';
import { Navigate } from 'react-router-dom';

export default function Patient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [queryOrder, setQueryOrder] = useState(true);
  const [searchID, setSearchID] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const [lastPage, setLastPage] = useState<number>(0);


  const searchQuery = () => {
    if (searchType === 'id') {
      setSearchID(searchTerm);
      setSearchName('');
    } else {
      setSearchID('');
      setSearchName(searchTerm);
    }
    setCurrentPage(1); // Reset to first page when a search is performed
  };

  const getApiEndpoint = (queryOrder: boolean, pageSize: number, pageNumber: number) => {
    if (searchID !== '') {
      return `/api/patient/id/${searchID}`;
    } else if (searchName !== '') {
      return `/api/patient/name/${searchName}`;
    } else {
      return `/api/patient/?order=${queryOrder ? 'asc' : 'desc'}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    }
  };

  const { data: patientsData, isLoading: patientsDataLoading, refetch } =
    useQueryWithTokenAPI<PatientResponse>(
      ['patient', searchID, searchName, currentPage.toString(), queryOrder.toString()],
      getApiEndpoint(queryOrder, 10, currentPage)
    );

  useEffect(() => {
    if (patientsData?.queryResult?.totalCount) {
      setLastPage(Math.ceil(patientsData.queryResult.totalCount / 10));
    }

  }, [patientsData])

  // Determine total pages based on search results or fallback to 200 pages
  const totalPages = searchID || searchName
    ? Math.ceil((patientsData?.queryResult?.count || 0) / 10)
    : lastPage;

  useEffect(() => {
    setCurrentPage(1);
    refetch(); // Refetch data when the criteria changes
  }, [searchType, refetch]);

  const { user } = useContext(UserContext);

  if (user.job_type === 'Admin') {
    return <Navigate to="/staff" replace />;
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="mb-6 font-bold text-2xl">Patient Management</h1>

      <div className="flex space-x-2 mb-4 w-full">
        <form
          className="flex space-x-2 mb-4 w-full"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            searchQuery(); // Trigger the search function
          }}
        >
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
          <Button type="submit" variant={'outline'}>
            <Search className="mr-2 w-4 h-4" />
            Search
          </Button>
        </form>
        <RegisterPatientForm refetch={refetch} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead className='cursor-pointer group' onClick={() => setQueryOrder(!queryOrder)}>
              <span className='flex justify-start items-center gap-2'>
                First Name <ArrowDownUp className='group-hover:text-black w-4 h-4' />
              </span>
            </TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Allergies</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patientsData?.data.length === 0 || patientsDataLoading ? (
            <TableEmpty colSpan={8} />
          ) : (
            patientsData?.data.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.first_name}</TableCell>
                <TableCell>{patient.last_name}</TableCell>
                <TableCell>{format(new Date(patient.date_of_birth), "PPP")}</TableCell>
                <TableCell>{patient.contact_info}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.allergies}</TableCell>
                <TableCell className=''>
                  <Dialog
                    open={openDialogId === patient.id.toString()}
                    onOpenChange={(open) => setOpenDialogId(open ? patient.id.toString() : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="p-0 w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='lg:w-[80%] 2lg:w-[50%] max-w-full max-h-[80%] flex flex-col'>
                      <DialogHeader>
                        <DialogTitle>Patient Details</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="info" className='overflow-auto h-full'>
                        <TabsList>
                          <TabsTrigger value="info">Info</TabsTrigger>
                          <TabsTrigger value="treatments">Treatments</TabsTrigger>
                          <TabsTrigger value="customObjects">Custom Objects</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info" className=''>
                          <Card>
                            <CardHeader>
                              <CardTitle>Patient Information</CardTitle>
                              {/* <CardTitle>{patient.first_name + " " + patient.last_name}</CardTitle>
                              <CardDescription>Patient Information</CardDescription> */}
                            </CardHeader>
                            <CardContent>
                              <UpdatePatientInfoForm
                                patientId={patient.id.toString()}
                                defaultValues={{
                                  first_name: patient.first_name,
                                  last_name: patient.last_name,
                                  date_of_birth: patient.date_of_birth.split('T')[0], // Extract the date portion
                                  contact_info: patient.contact_info,
                                  address: patient.address,
                                  allergies: patient.allergies,
                                }}
                                onSuccess={() => {
                                  setOpenDialogId(null);
                                  refetch();
                                }}
                                onCancel={() => {
                                  setOpenDialogId(null);
                                }}
                              />
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="treatments">
                          <AddTreatmentForm
                            patientId={patient.id}
                            onSuccess={() => {
                              setOpenDialogId(null);
                              refetch();
                            }}
                          />
                        </TabsContent>
                        <TabsContent value="customObjects">
                          <BlobList domain='patient' parent={patient.id.toString()} />
                          <AddCustomObjectForm domain='patient' parentID={patient.id.toString()} />
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {patientsData && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst
                className={`${currentPage === 1 && 'cursor-not-allowed opacity-50'}`}
                onClick={() => setCurrentPage(1)}
              />
            </PaginationItem>


            <PaginationItem>
              <PaginationPrevious
                className={`${currentPage === 1 && 'cursor-not-allowed opacity-50'}`}
                onClick={currentPage > 1 ? () => setCurrentPage(currentPage - 1) : undefined}
              />
            </PaginationItem>

            <PaginationItem>
              <div className='flex items-center'>
                <span>Page </span>
                <Input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    // Ensure the value is within valid page range
                    if (value >= 1 && value <= totalPages) {
                      setCurrentPage(value);
                    }
                  }}
                  className='w-16 mx-2'
                  min={1}
                  max={totalPages}
                />
                <span> of {totalPages}</span>
              </div>
            </PaginationItem>


            <PaginationItem>
              <PaginationNext
                className={`${currentPage === totalPages && 'cursor-not-allowed opacity-50'}`}

                onClick={currentPage < totalPages ? () => setCurrentPage(currentPage + 1) : undefined}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLast
                className={`${currentPage === totalPages && 'cursor-not-allowed opacity-50'}`}

                onClick={() => setCurrentPage(totalPages)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
