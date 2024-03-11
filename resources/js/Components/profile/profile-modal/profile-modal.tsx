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
import { Button } from "@/Components/ui/button"
import { Separator } from "@/Components/ui/separator"

interface ProfileModalProps {
    children: ReactElement
}

export default function ProfileModal({ children }: ProfileModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="max-w-screen-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Mon profil</AlertDialogTitle>
                </AlertDialogHeader>

                <div>
                    <h6 className="mb-2 text-xl font-semibold">Mes informations</h6>
                    <div className="w-full p-4 border border-accent rounded">
                        <ProfilePersonalInfoForm />
                    </div>
                </div>
                <div>
                    <h6 className="mb-2 text-xl font-semibold">Actions importantes</h6>
                    <div className="w-full p-4 border border-destructive rounded">
                        <div className="flex justify-center sm:justify-between">
                            <div className="hidden sm:block">
                                <div className="text-sm font-semibold">Déconnexion</div>
                                <div className="text-sm">Sans risque, vous pouvez facilement vous reconnectez ;)</div>
                            </div>
                            <form
                                action={route("logout")}
                                method="post"
                            >
                                <Button
                                    variant="destructive"
                                    type="submit"
                                >
                                    Me déconnecter
                                </Button>
                            </form>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between">
                            <div>
                                <div className="text-sm font-semibold">Suppression du compte</div>
                                <div className="text-sm">Après la suppression du compte, aucune récupération n'est possible.</div>
                            </div>
                            <ProfileDeleteForm />
                        </div>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Fermer</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
