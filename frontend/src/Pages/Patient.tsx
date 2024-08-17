import React from "react";
import { ChevronsDown } from "lucide-react";
import { Home, User, LogOut, Hospital,BookHeart } from "lucide-react";
function Patient() {
  return (
    <aside className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-900 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hospital</h1>
        <button className="p-2 rounded-full hover:bg-gray-700">
          <Hospital />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li className="flex items-center p-2 rounded-lg hover:bg-gray-700">
            <button className="flex justify-start">
              <Home className="mr-2 relative" />
              Dashboard
            </button>
          </li>
          <li className="flex items-center p-2 rounded-lg hover:bg-gray-700">
            <button className="flex justify-start">
              <User className="mr-2" />
              <span>Profile</span>
            </button>
          </li>
          <li className="flex items-center p-2 rounded-lg hover:bg-gray-700">
            <button className="flex justify-start">
              <BookHeart className="mr-2" />
              <span>Status</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>


  );
}


export default Patient;
