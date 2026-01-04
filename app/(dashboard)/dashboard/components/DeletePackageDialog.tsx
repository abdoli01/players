"use client";

import * as React from "react";
import { Package } from "@/types/package";
import { useDeletePackageMutation } from "@/services/api/packagesApi";
import { toast } from "react-toastify";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    packageData: Package;
}

export function DeletePackageDialog({ packageData }: Props) {
    const [open, setOpen] = React.useState(false);
    const [deletePackage, { isLoading }] = useDeletePackageMutation();

    const handleDelete = async () => {
        try {
            await deletePackage(packageData.id).unwrap();
            toast.success("پکیج با موفقیت حذف شد");
            setOpen(false);
        } catch (err: any) {
            toast.error("خطا در حذف پکیج");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-red-500">
                    {`حذف`}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>آیا از حذف "{packageData.title}" مطمئن هستید؟</DialogTitle>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <DialogClose className="px-4 py-2 bg-muted rounded">
                        لغو
                    </DialogClose>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? "در حال حذف..." : "حذف"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
