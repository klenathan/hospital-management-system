import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserContext } from './hooks/Auth/UserContext'
import LandingPage from './layouts/LandingPage'
import Dashboard from './layouts/Dashboard'
// import AppLayout from './routers/AppLayout'
// import { WithLoggedIn, WithLoggedOut } from './routers/WithLoggedin'

export default function App() {
  // const { loggedIn } = useContext(UserContext)

  return (
    <Routes>
      {/* Protection all route */}
      {/* <Route path='*' element={<NotFound />} /> */}

      {/* Login route */}
      {/* <Route path='/login' element={WithLoggedOut(Login)()} /> */}

      {/* Main route with checking login state */}
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/' element={<LandingPage />}>

        {/* <Route path='/' element={loggedIn ? <AppLayout /> : <WelcomePage />}>
        <Route path='/' element={WithLoggedIn(Analysis)()} />
        {Object.keys(RouteKeys).map((k: string) => {
          const Component = RouteLayoutMap[k as keyof typeof RouteLayoutMap]
          if (Component.allowAll) {
            const WrappedComponent = WithLoggedIn(Component.component)()
            return <Route key={k} path={k} element={WrappedComponent} />
          } else {
            const adminComponent = WithAdmin(Component.component)()
            return <Route key={k} path={k} element={adminComponent} />
          }
        })}
        */}
      </Route>
    </Routes>
  )
}
