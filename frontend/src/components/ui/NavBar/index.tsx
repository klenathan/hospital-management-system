import { Hospital } from "lucide-react"

export default function NavBar() {
    <header className="top-0 z-40 sticky bg-background px-4 md:px-6 py-3 md:py-4 border-b">
        <div className="flex justify-between items-center mx-auto container">
            <a href="#" className="flex items-center gap-2" >
                <Hospital className="w-6 h-6" />
                <span className="font-semibold text-lg">Hospital Management</span>
            </a>
            <div className="flex items-center gap-4">
                Hello
            </div>
        </div>
    </header>
}