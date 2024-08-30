import { useMutation, QueryOptions } from '@tanstack/react-query';
import { useAxiosWithToken } from './useAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
    // BlobMetadata,
    // Blob,
    GetBlobResponse,
    UseFetchBlobsParams,
} from '@/types/blobs';


export const useFileBlobsWithTokenAPI = (
    url: string,
    options?: QueryOptions<unknown>
) => {
    const axiosInstance = useAxiosWithToken();

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const authString = `root:root`;

            return await axiosInstance.post(url, formData, {
                headers: {
                    'x-auth-string': authString,
                    'Content-Type': 'multipart/form-data', // Ensure correct content type for file upload
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

    const fetchBlobs = async (): Promise<GetBlobResponse> => {
        const params = new URLSearchParams();

        if (domain) params.append('domain', domain);
        if (fileName) params.append('fileName', fileName);
        if (parent) params.append('parent', parent);

        const response = await axiosInstance.get<GetBlobResponse>('/api/blob/', {
            headers: {
                'x-auth-string': `root:root`,
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

    const fetchImage = async (): Promise<string> => {
        const response: AxiosResponse<Blob> = await axiosInstance.get(`/api/blob/image/${id}`, {
            headers: {
                'x-auth-string': `root:root`,
                'accept': 'image/*',
            },
            responseType: 'blob', // Important for handling binary data
            timeout: 5000, // Timeout after 5 seconds
        });

        // Convert the blob into a URL that can be used as a src for an img tag
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    };

    return useQuery<string, AxiosError>({
        queryKey: ['image', id],
        queryFn: fetchImage,
        staleTime: Infinity, // Data is considered fresh forever
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};


export const useDownloadBlob = () => {
    const axiosInstance = useAxiosWithToken();

    const downloadBlob = async (id: string): Promise<void> => {
        const response: AxiosResponse<Blob> = await axiosInstance.get(`/api/blob/download/${id}`, {
            headers: {
                'x-auth-string': `root:root`,
                'accept': 'application/octet-stream',
            },
            responseType: 'blob', // Important for handling binary data
            timeout: 5000, // Timeout after 5 seconds
        });

        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;


        // Extract file name from the Content-Disposition header if available
        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : `downloaded-file-${id}`;

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return useMutation<void, AxiosError, string>({
        mutationFn: downloadBlob,
    });
};