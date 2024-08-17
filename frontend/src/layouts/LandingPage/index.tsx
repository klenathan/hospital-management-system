import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">

      <div className="flex flex-1 justify-center items-center bg-muted *:w-full h-full">
        <div className="justify-center items-center gap-4 grid mx-auto px-4 md:px-6 text-center container">
          <div className="space-y-3">
            <h1 className="font-bold text-3xl md:text-4xl/tight tracking-tighter">
              Welcome to the Hospital Management System
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our Hospital Management System is designed to enhance the efficiency and effectiveness of managing
              patient care, staff scheduling, and appointments.
            </p>
          </div>
          <div className="space-y-2 mx-auto w-full max-w-sm">
            <Button
              // href="#"
              // onClick={() => console.log('hello')}
              onClick={() => window.location.href = '/'}
              className="inline-flex justify-center items-center bg-primary hover:bg-primary/90 disabled:opacity-50 shadow px-4 rounded-md w-full h-10 font-medium text-primary-foreground text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
      <footer className="bg-background md:py-12 p-6 w-full">
        <div className="gap-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 max-w-7xl text-sm container">
        </div>
      </footer>
    </div >
  )
}
