// import { User } from '@/types/user'
import { jwtDecode } from 'jwt-decode'
import { createContext, ReactNode, useEffect, useState } from 'react'

export const DefaultUserContext = {
  loggedIn: false,
  accessToken: '',
  user: {
    id: '',
    username: '',
    is_admin: false
  },
  login: (token: string) => {
    token
  },
  logout: () => {}
}

export const UserContext = createContext(DefaultUserContext)

export function UserProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState({
    id: '',
    username: '',
    is_admin: false
  })
  const [loggedIn, _setLoggedIn] = useState(localStorage.getItem('access_token') != '')
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') as string)

  useEffect(() => {
    const aToken = localStorage.getItem('access_token')

    if (aToken) {
      const decoded = jwtDecode(aToken)
      const currentTime = Date.now() / 1000

      if ((decoded.exp as number) < currentTime) {
        // setTimeout(logout, 5000)
      } else {
        setAccessToken(aToken)
        if (decoded.sub) {
          setUser(decoded.sub as any)
        }
        _setLoggedIn(true)
      }
    } else {
      setAccessToken('')
      _setLoggedIn(false)
    }
  }, [loggedIn, accessToken])

  const setLoggedIn = (accessToken: string, stateLoggin: boolean) => {
    localStorage.setItem('access_token', accessToken.toString())
    setAccessToken(accessToken.toString())

    _setLoggedIn(stateLoggin)
  }

  // In a real app, these methods would communicate with a backend,
  // obtain/verify a token, etc.
  const login = (token: string) => setLoggedIn(token, true)
  const logout = () => setLoggedIn('', false)

  return <UserContext.Provider value={{ loggedIn, accessToken, user, login, logout }}>{children}</UserContext.Provider>
}
