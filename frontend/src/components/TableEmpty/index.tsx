import { InboxIcon } from "lucide-react";
import { TableRow, TableCell } from "../ui/table";

type TableEmptyProps = {
    colSpan: number;
};

export default function TableEmpty({ colSpan }: TableEmptyProps) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center">
                <div className="flex flex-col justify-center items-center">
                    <InboxIcon className="w-8 h-8 text-muted-foreground" />
                    <p className="mt-2 font-medium text-lg">No results found</p>
                    <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                </div>
            </TableCell>
        </TableRow>
    );
}
