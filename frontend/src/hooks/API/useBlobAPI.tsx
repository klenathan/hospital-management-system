import { useContext } from 'react';
import { useMutation, useQuery, QueryOptions } from '@tanstack/react-query';
import { useAxiosWithToken } from './useAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { GetBlobResponse, UseFetchBlobsParams } from '@/types/blobs';
import { UserContext } from '@/hooks/Auth/UserContext';

export const useFileBlobsWithTokenAPI = (
    url: string,
    options?: QueryOptions<unknown>
) => {
    const axiosInstance = useAxiosWithToken();
    const { user } = useContext(UserContext);

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await axiosInstance.post(url, formData, {
                headers: {
                    'x-auth-string': `${user.username}:${user.password}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: (res: AxiosResponse) => {
            return res.data;
        },
        onError: (err: AxiosError) => {
            return err;
        },
        ...options,
    });

    return mutation;
};

export const useFetchBlobs = ({ domain, parent, fileName }: UseFetchBlobsParams, options?: QueryOptions<GetBlobResponse, AxiosError>) => {
    const axiosInstance = useAxiosWithToken();
    const { user } = useContext(UserContext);

    const fetchBlobs = async (): Promise<GetBlobResponse> => {
        const params = new URLSearchParams();

        if (domain) params.append('domain', domain);
        if (fileName) params.append('fileName', fileName);
        if (parent) params.append('parent', parent);

        const response = await axiosInstance.get<GetBlobResponse>('/api/blob/', {
            headers: {
                'x-auth-string': `${user.username}:${user.password}`,
            },
            params,
            timeout: 5000,
        });

        return response.data;
    };

    const queryKey = ['blobs', { domain, fileName, parent }];

    return useQuery<GetBlobResponse, AxiosError>({
        queryKey,
        queryFn: fetchBlobs,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        ...options,
    });
};

export const useFetchImage = (id: string) => {
    const axiosInstance = useAxiosWithToken();
    const { user } = useContext(UserContext);

    const fetchImage = async (): Promise<string> => {
        const response: AxiosResponse<Blob> = await axiosInstance.get(`/api/blob/image/${id}`, {
            headers: {
                'x-auth-string': `${user.username}:${user.password}`,
                'accept': 'image/*',
            },
            responseType: 'blob',
            timeout: 5000,
        });

        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    };

    return useQuery<string, AxiosError>({
        queryKey: ['image', id],
        queryFn: fetchImage,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};

export const useDownloadBlob = () => {
    const axiosInstance = useAxiosWithToken();
    const { user } = useContext(UserContext);

    const downloadBlob = async (id: string): Promise<void> => {
        const response: AxiosResponse<Blob> = await axiosInstance.get(`/api/blob/download/${id}`, {
            headers: {
                'x-auth-string': `${user.username}:${user.password}`,
                'accept': 'application/octet-stream',
            },
            responseType: 'blob',
            timeout: 5000,
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : `downloaded-file-${id}`;

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return useMutation<void, AxiosError, string>({
        mutationFn: downloadBlob,
    });
};
