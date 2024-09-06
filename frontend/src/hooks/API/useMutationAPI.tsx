import { QueryOptions, useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useAxios, useAxiosWithToken } from './useAxios'
import { useContext } from 'react'
import { UserContext } from '../Auth/UserContext'

export const useMutationWithoutTokenAPI = (url: string, options?: QueryOptions<unknown>) => {
  const mutation = useMutation({
    mutationFn: async (data: unknown) => {
      return await useAxios.post(url, data)
    },
    onSuccess: (res: AxiosResponse) => {
      return res.data
    },
    onError: (err: AxiosError) => {
      return err
    },
    ...options
  })

  return mutation
}

export const useMutationWithTokenAPI = (url: string, options?: QueryOptions<unknown>) => {
  const axiosInstance = useAxiosWithToken()
  const { user } = useContext(UserContext);

  const mutation = useMutation({
    mutationFn: async (data: unknown) => {
      return await axiosInstance.post(url, data, {
        headers: {
          'x-auth-string': `${user.username}:${user.password}`
        }
      })
    },
    onSuccess: (res: AxiosResponse) => {
      return res.data
    },
    onError: (err: AxiosError) => {
      return err
    },
    ...options
  })

  return mutation
}

