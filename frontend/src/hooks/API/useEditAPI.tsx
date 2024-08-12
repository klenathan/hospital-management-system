import { useMutation, useQueryClient, MutationOptions } from '@tanstack/react-query';
import { useAxiosWithToken } from './useAxios';
/** Hook for EDIT requests with an access token */
export const usePutWithTokenAPI = <T,>(
    url: string,
    options?: MutationOptions<T, unknown, Partial<T>, unknown>
) => {
    const axiosInstance = useAxiosWithToken();
    const queryClient = useQueryClient();

    const putData = async (data: Partial<T>): Promise<T> => {
        const response = await axiosInstance.put(url, data);
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: putData,
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
        ...options,
    });

    return mutation;
};