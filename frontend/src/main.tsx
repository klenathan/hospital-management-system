import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { UserProvider } from './hooks/Auth/UserContext'
import ErrorPage from './layouts/ErrorPage'
import LandingPage from './layouts/LandingPage'
import './styles/index.css'
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
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
