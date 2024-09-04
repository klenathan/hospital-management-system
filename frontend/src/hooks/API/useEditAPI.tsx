// usePutWithTokenAPI.ts
import { useMutation, useQueryClient, MutationOptions } from '@tanstack/react-query';
import { useAxiosWithToken } from './useAxios';
import { useContext } from 'react';
import { UserContext } from '@/hooks/Auth/UserContext';
/**
 * Custom hook for making authenticated PUT requests with separate response and variables types.
 *
 * @param url - The endpoint URL for the PUT request.
 * @param options - Optional mutation options.
 * @returns The mutation object from React Query.
 */
export const usePutWithTokenAPI = <TResponse, TVariables = unknown, E = unknown>(
    url: string,
    options?: MutationOptions<TResponse, E, TVariables, unknown>
) => {
    const axiosInstance = useAxiosWithToken();
    const queryClient = useQueryClient();

    // Define the auth string
    const { user } = useContext(UserContext);
    // Function to perform the PUT request
    const putData = async (data: TVariables): Promise<TResponse> => {
        const response = await axiosInstance.put(url, data, {
            headers: {
                'x-auth-string': `${user.username}:${user.password}`,
            },
        });
        return response.data;
    };

    // Initialize the mutation
    const mutation = useMutation<TResponse, E, TVariables, unknown>({
        mutationFn: putData,
        onSuccess: () => {
            queryClient.invalidateQueries(); // Optionally, specify query keys to invalidate specific queries
        },
        ...options,
    });

    return mutation;
};
