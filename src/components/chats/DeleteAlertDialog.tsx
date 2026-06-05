import type { ReactNode } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import React from "react";

type DeleteAlertDialogType = {
  title: string;
  description?: string;
  children: ReactNode;
  handleActionButton: () => void;
};

 const DeleteAlertDialog = React.memo(({children, handleActionButton, title, description}: DeleteAlertDialogType) => {
    return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer text-slate-50"
            onClick={handleActionButton}
          >
            Lanjutkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
 })

 export default DeleteAlertDialog;