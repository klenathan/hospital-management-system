import { Toaster } from '@/components/ui/toaster'
import Dashboard from '@/layouts/Dashboard'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className='relative flex bg-background w-full h-full min-h-screen transition-all duration-100 ease-in-out'>
      <Dashboard />
      <Toaster />
      <Outlet />
    </div>
  )
  // }
}
