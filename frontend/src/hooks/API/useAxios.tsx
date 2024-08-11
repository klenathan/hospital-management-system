// import { getRefreshToken } from '@/services/refresh-token/api'
// import { useUserStore } from '@/store/user-store'
// import { toast } from '@/components/ui/use-toast'
import axios, { AxiosResponse, CreateAxiosDefaults } from 'axios'
import { useContext, useEffect } from 'react'
import { UserContext } from '../Auth/UserContext'

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_BE_ENDPOINT}`,
  timeout: 2000
  //   headers: {
  //     'x-access-token': ''
  //   }
}

/**
 * The useAxios hook use for calling api without accesstoken
 * Best practices use in login in and sign up
 */
export const useAxios = axios.create(baseConfig)

useAxios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

useAxios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * The useAxios hook use for calling api with accesstoken
 * Best practices use when user logged in
 */

export const useAxiosWithToken = () => {
  const { accessToken, logout } = useContext(UserContext)

  // Define request/response and error interceptors
  const reqResInterceptor = (config: any) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }
  }

  const reqErrInterceptor = async (error: any) => Promise.reject(error)

  const resResInterceptor = async (response: AxiosResponse) => {
    // Handle successful responses as needed
    return response
  }

  const resErrInterceptor = async (error: any) => {
    const originalRequest = error.config
    console.log(originalRequest)

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = false
      console.error('Token refresh failed', error)

      setTimeout(logout, 3000)

      // try {
      //   // const newAccessToken = await authContext.refreshToken(authContext.user?.loginToken ?? ' ')

      //   // instance.defaults.headers.common['x-access-token'] = newAccessToken
      //   // originalRequest.headers['x-access-token'] = newAccessToken
      //   if (accessToken) {
      //     originalRequest.headers.Authorization = `Bearer ${accessToken}`
      //   }

      //   return useAxios(originalRequest)
      // } catch (error) {
      //   console.error('Token refresh failed', error)

      //   navigate('/', { replace: true })
      //   // logout()
      // }
    }
    return Promise.reject(error)
  }

  // Set up the interceptors with useEffect
  useEffect(() => {
    if (accessToken) {
      const reqInterceptor = useAxios.interceptors.request.use(reqResInterceptor, reqErrInterceptor)

      const resInterceptor = useAxios.interceptors.response.use(resResInterceptor, resErrInterceptor)

      // Cleanup function
      return () => {
        useAxios.interceptors.request.eject(reqInterceptor)
        useAxios.interceptors.response.eject(resInterceptor)
      }
    }
  }, [accessToken])

  return useAxios
}
