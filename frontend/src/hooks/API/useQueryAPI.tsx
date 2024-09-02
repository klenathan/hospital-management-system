import { QueryOptions, useQuery } from '@tanstack/react-query'
import { useAxios, useAxiosWithToken } from './useAxios'
import { useContext } from 'react';
import { UserContext } from '../Auth/UserContext';

export const useQueryWithoutTokenAPI = <T,>(key: string[], url: string, headers?: Record<string, string>, options?: QueryOptions<T, unknown>) => {
  const fetchData = async (): Promise<T> => {
    const response = await useAxios.get(url, {
      headers,
    });
    return response.data;
  }

  const data = useQuery({
    queryKey: key,
    queryFn: fetchData,
    ...options
  });

  return data;
}

export const useQueryWithTokenAPI = <T,>(key: string[], url: string, options?: QueryOptions<T, unknown>) => {
  const axiosInstance = useAxiosWithToken();
  const { user } = useContext(UserContext);

  const fetchData = async (): Promise<T> => {
    const response = await axiosInstance.get(url, {
      headers: {
        'x-auth-string': `${user.username}:${user.password}`,
      },
      timeout: 5000, // Timeout after 5 seconds
    });
    return response.data;
  };

  const data = useQuery({
    queryKey: key,
    queryFn: fetchData,
    staleTime: Infinity, // Data is considered fresh forever, so it won't refetch
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnMount: false, // Disable refetching when the component remounts
    refetchOnReconnect: false, // Disable refetching when the browser regains connection
    ...options,
  });

  return data;
};



