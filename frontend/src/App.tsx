import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserContext } from './hooks/Auth/UserContext'
import LandingPage from './layouts/LandingPage'
import AppLayout from './routers/AppLayout'
import { WithLoggedIn } from './routers/WithLoggedin'
import { RouteKeys, RouteLayoutMap } from './routers/RouteLayouts'
export default function App() {
  // const { loggedIn } = useContext(UserContext)

  const loggedIn = true;

  return (
    <Routes>
      {/* Protection all route */}
      {/* <Route path='*' element={<NotFound />} /> */}

      {/* Login route */}
      {/* <Route path='/login' element={WithLoggedOut(Login)()} /> */}

      {/* Main route with checking login state */}
      <Route path='/' element={loggedIn ? <AppLayout /> : <LandingPage />}>
        <Route path='/' element={<LandingPage />} />
        {Object.keys(RouteKeys).map((k: string) => {
          const Component = RouteLayoutMap[k as keyof typeof RouteLayoutMap]
          if (Component.allowAll) {
            const WrappedComponent = WithLoggedIn(Component.component)()
            return <Route key={k} path={k} element={WrappedComponent} />
          }
          //  else {
          //   const adminComponent = WithAdmin(Component.component)()
          //   return <Route key={k} path={k} element={adminComponent} />
          // }
        })}
      </Route>
    </Routes>
  )
}
