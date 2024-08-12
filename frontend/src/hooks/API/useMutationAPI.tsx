import { QueryOptions, useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useAxios, useAxiosWithToken } from './useAxios'

export const useMutationWithoutTokenAPI = (url: string, options?: QueryOptions<unknown>) => {
  const mutation = useMutation({
    mutationFn: async (data: any) => {
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

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await axiosInstance.post(url, data)
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
