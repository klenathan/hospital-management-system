import { Outlet } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  return (
    <div className="flex justify-center items-start">
      <Dashboard />
      <Toaster />
      <div className="flex flex-1 justify-start items-start py-6 min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}