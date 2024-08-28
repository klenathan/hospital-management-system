import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileBlobsWithTokenAPI } from '@/hooks/API/useBlobAPI';
import { useToast } from '@/components/ui/use-toast';

interface AddCustomObjectFormProps {
    domain: 'staff' | 'patient' | 'appointment';
    parentID: string;
}

export default function AddCustomObjectForm({ domain, parentID }: AddCustomObjectFormProps) {
    const { toast } = useToast();
    const uploadFile = useFileBlobsWithTokenAPI('/api/blob/');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            toast({
                variant: 'destructive',
                title: 'No file selected',
                description: 'Please select a file to upload.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('blob', selectedFile);
        formData.append('domain', domain);
        formData.append('parentId', parentID);

        uploadFile.mutate(formData, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'File uploaded successfully!',
                });
                setSelectedFile(null); // Reset the file input after successful upload
            },
            onError: (error) => {
                console.error('Error uploading file:', error);
                toast({
                    variant: 'destructive',
                    title: 'Upload failed',
                    description: 'There was a problem uploading the file.',
                });
            },
        });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="custom_blob">Upload a file</Label>
                <Input
                    id="custom_blob"
                    name="custom_blob"
                    type="file"
                    accept="blob/*"
                    onChange={handleFileChange}
                />
            </div>
            <Button type="submit">Add Custom Object</Button>
        </form>
    );
}
