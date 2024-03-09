import { ReactElement } from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import ProfileDeleteForm from "../profile-delete-form/profile-delete-form"

interface ProfileModalProps {
    children: ReactElement
}

export default function ProfileModal({ children }: ProfileModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="max-w-screen-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Profile</AlertDialogTitle>
                </AlertDialogHeader>

                <ProfileDeleteForm />

                <AlertDialogFooter>
                    <AlertDialogAction>Fermer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
