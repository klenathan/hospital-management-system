import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileBlobsWithTokenAPI } from '@/hooks/API/useBlobAPI';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { DialogClose, DialogFooter } from '../ui/dialog';

interface AddCustomObjectFormProps {
    domain: 'staff' | 'patient' | 'appointment';
    parentID: string;
}

export default function AddCustomObjectForm({ domain, parentID }: AddCustomObjectFormProps) {
    const { toast } = useToast();
    const uploadFile = useFileBlobsWithTokenAPI('/api/blob/');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

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

        setUploading(true);
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
                setTimeout(() => {
                    window.location.reload();
                }, 700);
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

            <DialogFooter className="col-span-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button disabled={uploading} type="submit">
                    {uploading ?
                        <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Please wait
                        </>
                        : 'Add Custom Object'}
                </Button>
            </DialogFooter>


        </form>
    );
}
