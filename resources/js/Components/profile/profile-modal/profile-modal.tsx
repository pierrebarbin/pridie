import { ReactElement } from "react"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import ProfileDeleteForm from "../profile-delete-form/profile-delete-form"
import ProfilePersonalInfoForm from "../profile-personal-info-form/profile-personal-info-form"

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

                <ProfilePersonalInfoForm />

                <ProfileDeleteForm />

                <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
