import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { UserProvider } from './hooks/Auth/UserContext'
import ErrorPage from './layouts/ErrorPage'
import LandingPage from './layouts/LandingPage'
import './styles/index.css'
import AppointmentManagement from './layouts/AppointmentManagement'
import StaffManagement from './layouts/StaffManagement'
import ReportPage from './layouts/ReportPage'
import App from './App'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/', element: <App />,

    children: [
      {
        path: '/djtmecuocdoi',
        element: <div className='bg-red-300 w-screen h-screen'>Hello</div>
      },
      {
        path: '',
        element: <LandingPage />
      },
      {
        path: '/appointment',
        element: <AppointmentManagement />
      },
      {
        path: '/staff',
        element: <StaffManagement />
      },
      {
        path: '/reports',
        element: <ReportPage />
      }
    ],
    errorElement: <ErrorPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </UserProvider>
)