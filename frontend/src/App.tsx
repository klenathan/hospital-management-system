import { Navigate, Outlet } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
import { Toaster } from "@/components/ui/toaster"
import { useContext } from "react";
import { UserContext } from "./hooks/Auth/UserContext";

export default function App() {
  const { isUserLoggedIn } = useContext(UserContext);

  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

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