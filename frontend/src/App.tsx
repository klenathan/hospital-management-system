
import Login from "./Pages/Login";



import Patient from "./Pages/Patient";
import DataTable from "./Pages/DataTable"; 

function App() {
  return (
    <div className="flex">
    <Patient />
    <main className="flex-1 bg-gray-100 min-h-screen">
        <DataTable />
      </main>
    
  </div>
  )
}


export default App;