"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const DeleteSoalDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteSoalDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] sm:max-w-[90%] p-6">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl sm:text-lg font-bold text-primary dark:text-foreground">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-sm sm:text-base">
            This action cannot be undone. This will permanently delete the soal
            and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 space-y-1">
          <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary text-primary-foreground font-medium shadow-sm transition-all"
          >
            Delete Soal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
