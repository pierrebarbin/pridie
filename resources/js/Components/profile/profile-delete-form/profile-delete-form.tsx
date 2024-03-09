import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Button, buttonVariants } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import clsx from "clsx";

export default function ProfileDeleteForm() {

    const deleteAccount = () => {
        router.delete(route('profile.destroy'), {
            preserveState: true
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Supprimer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Etes vous sûr de vouloir supprimer votre compte?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est permanente et aucun retour arrière est possible.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Non, je souhaite garder mon compte</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={deleteAccount}
                        className={clsx(buttonVariants({variant: "destructive"}))}
                    >
                        Oui je suis sûr
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}