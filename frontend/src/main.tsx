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


import { RedirectIfUnAuthenticated, RedirectIfAuthenticated } from './components/Redirect';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RedirectIfAuthenticated>
        <LandingPage />
      </RedirectIfAuthenticated>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: (
      <RedirectIfAuthenticated>
        <Login />
      </RedirectIfAuthenticated>
    ),
    errorElement: <ErrorPage />,
  },
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RedirectIfUnAuthenticated />,
        children: [
          {
            path: '/patient',
            element: <Patient />,
          },
          {
            path: '/djtmecuocdoi',
            element: <div className='bg-red-300 w-screen h-screen'>Hello</div>,
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
