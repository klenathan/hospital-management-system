import { useMutation, useQueryClient, MutationOptions } from '@tanstack/react-query';
import { useAxios, useAxiosWithToken } from './useAxios'

export const useDeleteWithoutTokenAPI = <T,>(
    baseUrl: string,
    options?: MutationOptions<T, unknown, string, unknown>
) => {
    const queryClient = useQueryClient();

    const deleteData = async (id: string): Promise<T> => {
        const response = await useAxios.delete(`${baseUrl}/${id}`); // Use axios for API call
        return response.data;
    };

    return useMutation({
        mutationFn: deleteData,
        onSuccess: () => {
            queryClient.invalidateQueries(); // Invalidate queries to refetch relevant data
        },
        ...options,
    });
};

/** Hook for DELETE requests with an access token */
export const useDeleteWithTokenAPI = <T,>(
    url: string,
    options?: MutationOptions<T, unknown, void, unknown>
) => {
    const axiosInstance = useAxiosWithToken();
    const queryClient = useQueryClient();

    const deleteData = async (): Promise<T> => {
        const authString = `root:root`;
        const response = await axiosInstance.delete(url, {
            headers: {
                'x-auth-string': authString,
            },
        });
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: deleteData,
        onSuccess: () => {
            queryClient.invalidateQueries();
        },
        ...options,
    });

    return mutation;
};

