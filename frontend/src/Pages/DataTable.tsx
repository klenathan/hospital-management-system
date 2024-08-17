import React, { useState } from "react";
import { Eye, MoreHorizontal, Search } from "lucide-react";
import { data } from "@/Pages/data.tsx";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Define the Patient type
interface Patient {
  id: number;
  "First Name": string;
  "Last Name": string;
  "Date of Birth": string;
  Email: string;
  Address: string;
  allergies: string;
  "Created at": string;
  "Updated at": string;
  Status: string;
}

function DataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>(data);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatientId, setDeletePatientId] = useState<number | null>(null);
  // patient implicy with any type. 
  const handleEdit = (patient: Patient) => {
    // set the state with the patient data to be edited
    // this will trigger the display of the edit form with the current patient details
    setEditPatient(patient);
  };

  const handleUpdate = () => {
    // check if patient to be updated
    if (editPatient) {
      setPatients((prevPatients) =>
        //replace the old patient information(first && lastname) to the updated data
        prevPatients.map((patient) =>
          patient.id === editPatient.id ? editPatient : patient
        )
      );
      // reset the editPatient state to null after the update is complete
      setEditPatient(null);
    }
  };

  const handleDelete = (id: number) => {
    setDeletePatientId(id);
  };

  const confirmDelete = () => {
    if (deletePatientId !== null) {
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.id !== deletePatientId)
      );
      setDeletePatientId(null);
    }
  };
  // event fixed using changeEvent (note) this fixed is temporary
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredPatients = data.filter((patient) => {
      return (
        patient.id.toString().toLowerCase().includes(value) ||
        patient["First Name"].toLowerCase().includes(value) ||
        patient["Last Name"].toLowerCase().includes(value)
      );
    });
    setPatients(filteredPatients);
  };

  return (
    <div className="flex-1 p-6 bg-white shadow-md">
      <h1 className="text-3xl font-bold mb-5">Patient</h1>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center bg-gray-200 rounded-lg p-2 ">
          <Search className="mr-2 text-gray-600" />
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearch}
            className="bg-transparent w-full focus:outline-none text-sm text-black"
          />
        </div>

        <div>
          <button className="border border-black rounded-xl px-4 py-2 rounded hover:bg-gray-100">
            Register a new patient
          </button>
        </div>

        <Table className="min-w-full border">
          <thead>
            <tr className="border bg-gray-100">
              <th className="text-center px-4 py-2">ID</th>
              <th className="text-center px-4 py-2">First Name</th>
              <th className="text-center px-4 py-2">Last Name</th>
              <th className="text-center px-4 py-2">Date of Birth</th>
              <th className="text-center px-4 py-2">Email</th>
              <th className="text-center px-4 py-2">Address</th>
              <th className="text-center px-4 py-2">allergies</th>
              <th className="text-center px-4 py-2">Created at</th>
              <th className="text-center px-4 py-2">Updated at</th>
              <th className="text-center px-4 py-2">Status</th>
              <th className="text-center px-4 py-2">Action</th>
            </tr>
          </thead>
          <TableBody>
            {patients.map((item) => (
              <tr className="border" key={item["id"]}>
                <td className=" text-center px-4 py-2">{item["id"]}</td>
                <td className=" text-center px-4 py-2">{item["First Name"]}</td>
                <td className=" text-center px-4 py-2">{item["Last Name"]}</td>
                <td className=" text-center px-4 py-2">
                  {item["Date of Birth"]}
                </td>
                <td className=" text-center px-4 py-2">{item["Email"]}</td>
                <td className=" text-center px-4 py-2">{item["Address"]}</td>
                <td className=" text-center px-4 py-2">{item["allergies"]}</td>
                <td className=" text-center px-4 py-2">{item["Created at"]}</td>
                <td className=" text-center px-4 py-2">{item["Updated at"]}</td>
                <td className=" text-center px-4 py-2">{item["Status"]}</td>
                <th className="text-center px-6 py-2 h-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </th>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
            
      {/* Edit Patient Form */}
      {editPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <Input
                type="text"
                value={editPatient["First Name"]}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, "First Name": e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <Input
                type="text"
                value={editPatient["Last Name"]}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, "Last Name": e.target.value })
                }
              />
            </div>
            <Button onClick={handleUpdate} className="mr-2">Save</Button>
            <Button variant="outline" onClick={() => setEditPatient(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Delete Patient form */}
      {deletePatientId !== null && (
        <AlertDialog open onOpenChange={(open) => !open && setDeletePatientId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this patient ? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  confirmDelete();
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default DataTable;
