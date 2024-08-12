import { QueryOptions, useQuery } from '@tanstack/react-query'
import { useAxios, useAxiosWithToken } from './useAxios'

export const useQueryWithoutTokenAPI = <T,>(key: string[], url: string, options?: QueryOptions<T, unknown>) => {
  const fetchData = async (): Promise<T> => {
    const response = await useAxios.get(url)
    return response.data
  }

  const data = useQuery({
    queryKey: key,
    queryFn: fetchData,
    ...options
  })

  return data
}

export const useQueryWithTokenAPI = <T,>(key: string[], url: string, options?: QueryOptions<T, unknown>) => {
  const axiosInstance = useAxiosWithToken()

  const fetchData = async (): Promise<T> => {
    const response = await axiosInstance.get(url)
    return response.data
  }

  const data = useQuery({
    queryKey: key,
    queryFn: fetchData,
    ...options
  })

  return data
}
