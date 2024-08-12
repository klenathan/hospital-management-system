import { useMutation, useQueryClient, MutationOptions } from '@tanstack/react-query';
import { useAxiosWithToken } from './useAxios';
/** Hook for DELETE requests with an access token */
export const useDeleteWithTokenAPI = <T,>(
    url: string,
    options?: MutationOptions<T, unknown, void, unknown>
) => {
    const axiosInstance = useAxiosWithToken();
    const queryClient = useQueryClient();

    const deleteData = async (): Promise<T> => {
        const response = await axiosInstance.delete(url);
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
