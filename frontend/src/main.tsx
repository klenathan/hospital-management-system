// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import ReactDOM from 'react-dom/client'
// import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import { UserProvider } from './hooks/Auth/UserContext'
// import ErrorPage from './layouts/ErrorPage'
// import LandingPage from './layouts/LandingPage'
// import Dashboard from './layouts/Dashboard'
// import './styles/index.css'
// const queryClient = new QueryClient()

// const router = createBrowserRouter([
//   {
//     path: '/',

//     children: [
//       {
//         path: '/djtmecuocdoi',
//         element: <div className='bg-red-300 w-screen h-screen'>Hello</div>
//       },
//       {
//         path: '',
//         element: <LandingPage />
//       },
//       {
//         path: '/dashboard',
//         element: <Dashboard />
//       }
//     ],
//     errorElement: <ErrorPage />
//   }
// ])

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <UserProvider>
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={router} />
//     </QueryClientProvider>
//   </UserProvider>
// )



import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// import { ThemeProvider } from './components/Theme/theme-provider'
import { UserProvider } from './hooks/Auth/UserContext'
import './styles/index.css'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'> */}
        <App />
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </UserProvider>
  </BrowserRouter>
)
