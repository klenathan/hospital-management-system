import { useState } from 'react';
import { useDownloadBlob, useFetchBlobs, useFetchImage } from '@/hooks/API/useBlobAPI';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { FileTextIcon, ArrowDownToLine, FileImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

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
            <ul className='gap-2 grid'>
                {data?.data.map(blob => {
                    const uploadDate = new Date(blob.uploadDate);
                    return (
                        <Card key={blob._id} className="w-full">
                            <CardContent className="p-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-1 justify-start items-center gap-2 text-muted-foreground">
                                        {isImage(blob.metadata.fileName) ?
                                            <>
                                                <FileImageIcon className='w-4 h-4' />
                                                <h3
                                                    onClick={() => setSelectedBlob(blob._id)}
                                                    className="font-semibold text-primary hover:underline cursor-pointer"
                                                >
                                                    {blob.metadata.fileName}
                                                </h3>
                                            </>

                                            :
                                            <>
                                                <FileTextIcon className='w-4 h-4' />
                                                <h3 className="font-semibold text-black">
                                                    {blob.metadata.fileName}
                                                </h3>
                                            </>
                                        }

                                        {uploadDate.toISOString().split('T')[0]}
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
                                    className="border-8 border-gray-200 rounded-lg max-w-full h-auto"
                                />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
