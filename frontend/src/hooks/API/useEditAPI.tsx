import { useQuery, QueryOptions } from '@tanstack/react-query';
import { useAxiosWithToken } from './useAxios';
/** Hook for EDIT requests with an access token */
export const useQueryWithTokenAPI = <T,>(key: string[], url: string, options?: QueryOptions<T, unknown>) => {
    const axiosInstance = useAxiosWithToken()

    const fetchData = async (): Promise<T> => {
        const authString = `root:root`
        const response = await axiosInstance.get(url, {
            headers: {
                'x-auth-string': authString
            }
        })
        return response.data
    }

    const data = useQuery({
        queryKey: key,
        queryFn: fetchData,
        ...options
    })

    return data
}
