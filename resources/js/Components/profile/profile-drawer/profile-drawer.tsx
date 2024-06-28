import { Button } from "@/Components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/Components/ui/drawer"
import ProfileDeleteForm from "@/Components/profile/profile-delete-form/profile-delete-form"
import ProfilePersonalInfoForm from "@/Components/profile/profile-personal-info-form/profile-personal-info-form"
import { Separator } from "@/Components/ui/separator"
import { ScrollArea } from "@/Components/ui/scroll-area"
import {User} from "lucide-react";

export default function ProfileDrawer() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                    <User className="h-5 w-5" />
                    <span className="text-xs">Profil</span>
                </div>
            </DrawerTrigger>
            <DrawerContent className="block h-[90%] px-4 pb-0">
                <ScrollArea className="h-full pb-16 space-y-6">
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
                                    >
                                        Me déconnecter
                                    </Button>
                                </form>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-center sm:justify-between">
                                <div className="hidden sm:block">
                                    <div className="text-sm font-semibold">Suppression du compte</div>
                                    <div className="text-sm">Après la suppression du compte, aucune récupération n'est possible.</div>
                                </div>
                                <ProfileDeleteForm />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    )
}
