import { useState } from 'react';
import { useDownloadBlob, useFetchBlobs, useFetchImage } from '@/hooks/API/useBlobAPI';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileTextIcon, ArrowDownToLine, FileImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function BlobList({ domain, parent }: { domain: string; parent: string }) {
    const { data, isLoading, isError, error } = useFetchBlobs({ domain, parent });
    const [selectedBlob, setSelectedBlob] = useState<string>('');

    const downloadBlob = useDownloadBlob();



    const isImage = (fileName: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    const { data: imageUrl, isLoading: isImageLoading, isError: isImageError } = useFetchImage(selectedBlob);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.message}</div>;
    }

    return (
        <div>
            {data?.count !== 0 && <Label htmlFor="custom_blob">File</Label>}
            <ul className='gap-2 grid pb-2'>
                {data?.data.map(blob => {
                    const uploadDate = new Date(blob.uploadDate);
                    const formattedDate = uploadDate.toLocaleDateString('en-GB')
                    return (
                        <Card key={blob._id} className="w-full">
                            <CardContent className="p-3">
                                <div className="flex justify-between items-center">
                                    <div className="relative flex flex-1 justify-between items-center gap-2 w-full text-muted-foreground">
                                        {isImage(blob.metadata.fileName) ?
                                            <div className='flex flex-1 justify-start items-center gap-2'>
                                                <FileImageIcon className='w-5 h-5' />
                                                <h3
                                                    onClick={() => setSelectedBlob(blob._id)}
                                                    className="max-w-56 font-semibold text-primary hover:underline truncate cursor-pointer"
                                                >
                                                    {blob.metadata.fileName}
                                                </h3>
                                            </div>

                                            :
                                            <div className='flex flex-1 justify-start items-center gap-2'>
                                                <FileTextIcon className='w-5 h-5' />
                                                <h3 className="max-w-56 font-semibold text-black truncate">
                                                    {blob.metadata.fileName}
                                                </h3>
                                            </div>
                                        }

                                        <div className='mr-2 w-max'>
                                            {formattedDate}
                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="outline" size="icon" onClick={() => downloadBlob.mutate(blob._id)}>
                                            <ArrowDownToLine className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </ul>

            <Dialog open={selectedBlob != ''} onOpenChange={() => setSelectedBlob('')}>
                <DialogContent className="w-max">
                    <DialogHeader>
                        <DialogTitle>Preview</DialogTitle>
                    </DialogHeader>
                    {selectedBlob && (
                        <div className="p-5 w-max overflow-hidden">
                            {isImageLoading ? (
                                <div>Loading image...</div>
                            ) : isImageError ? (
                                <div>Error loading image.</div>
                            ) : (
                                <img
                                    src={imageUrl}
                                    alt={imageUrl}
                                    className="border-8 border-gray-200 rounded-lg max-w-96 h-auto object-scale-down"
                                />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
