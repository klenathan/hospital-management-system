import { Outlet } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
export default function App() {
  return (
    <div className="flex justify-center items-start">
      <Dashboard />
      <div className="flex-1 py-6">
        <Outlet />
      </div>
    </div>
  )
}