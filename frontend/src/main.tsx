import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { UserProvider } from './hooks/Auth/UserContext';
import ErrorPage from './layouts/ErrorPage';
import LandingPage from './layouts/LandingPage';
import './styles/index.css';
import AppointmentManagement from './layouts/AppointmentManagement';
import StaffManagement from './layouts/StaffManagement';
import ReportPage from './layouts/ReportPage';
import App from './App';
import Login from './layouts/Login';
import Patient from './layouts/Patient';
import DoctorSchedule from './layouts/DoctorSchedule';


// import { RedirectIfUnAuthenticated, RedirectIfAuthenticated } from './components/Redirect';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LandingPage />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: (
      <Login />
    ),
    errorElement: <ErrorPage />,
  },
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        children: [
          {
            path: '/patient',
            element: <Patient />,
          },
          {
            path: '/schedule',
            element: <DoctorSchedule />,
          },
          {
            path: '/appointment',
            element: <AppointmentManagement />,
          },
          {
            path: '/staff',
            element: <StaffManagement />,
          },
          {
            path: '/reports',
            element: <ReportPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </UserProvider>
);

