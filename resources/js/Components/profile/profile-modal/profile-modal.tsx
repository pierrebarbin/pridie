import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { ReactElement } from "react";

interface ProfileModalProps {
    children: ReactElement
}

export default function ProfileModal({children} : ProfileModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-screen-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Profile</AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                <AlertDialogAction>Valider</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}