import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/Components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/Components/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger} from "@/Components/ui/drawer";
import {GearIcon, HomeIcon, MixerVerticalIcon, PersonIcon} from "@radix-ui/react-icons";
import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker";
import MenuFilters from "@/Components/menu/menu-filters/menu-filters";
import React from "react";
import ThreadListMobile from "@/Components/thread/thread-list/thread-list-mobile/thread-list-mobile";
import {useFilterStore} from "@/Stores/filter-store";
import {useShallow} from "zustand/react/shallow";
import {useMediaQuery} from "@/Hooks/use-media-query";
import {Switch} from "@/Components/ui/switch";
import {Label} from "@/Components/ui/label";

export default function MenuMobile() {

    const {
        removeCurrentThread
    } = useFilterStore(useShallow((state) => ({
        removeCurrentThread: state.removeCurrentThread
    })))

    const matches = useMediaQuery('(min-width: 360px)')

    return (
        <div className="p-2 z-50 bg-secondary fixed bottom-[15px] left-[50%] -translate-x-1/2 rounded-lg shadow">
            <NavigationMenu className="max-w-full">
                <NavigationMenuList className="space-x-3">
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({ variant: "secondary"}),
                                "h-auto flex-col gap-1"
                            )}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <div className="flex items-center flex-col gap-1">
                                        <GearIcon className="h-5 w-5" />
                                        <span className="text-xs">Config</span>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="p-4 pt-0 h-[90%]">
                                    <div className="mt-6 space-y-6">
                                        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="default-tags">Tags par défaut</Label>
                                                <div className="text-[0.8rem] text-muted-foreground">
                                                    Des tags sont automatiquement assignés à votre compte pour préfiltrer les articles
                                                </div>
                                            </div>
                                            <div>
                                                <Switch
                                                    id="default-tags"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuLink >
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({ variant: "secondary"}),
                                "h-auto"
                            )}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <div className="flex items-center flex-col gap-1">
                                        <PersonIcon className="h-5 w-5" />
                                        <span className="text-xs">Profil</span>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="p-4 pt-0 h-1/3">
                                    <div className="mt-6">
                                        <DarkModePicker />
                                    </div>
                                    <DrawerFooter>
                                        <form action={route('logout')} method="post">
                                            <Button variant="destructive" className="w-full">Déconnexion</Button>
                                        </form>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuLink >
                    </NavigationMenuItem>
                    {matches ? (
                        <NavigationMenuItem className="w-full">
                            <NavigationMenuLink
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    buttonVariants(),
                                    "rounded-full shadow-none px-3 py-3 h-auto"
                                )}

                                onSelect={() => {
                                    removeCurrentThread()
                                }}
                            >
                                <HomeIcon className="w-5 h-5" />
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ): null}
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({ variant: "secondary"}),
                                "h-auto flex-col gap-1"
                            )}
                        >
                            <ThreadListMobile />
                            <span className="text-xs">Flux</span>
                        </NavigationMenuLink >
                    </NavigationMenuItem>
                    <NavigationMenuItem >
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({variant: "secondary"}),
                                "h-auto"
                            )}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <div className="flex items-center flex-col gap-1">
                                        <MixerVerticalIcon className="h-5 w-5" />
                                        <span className="text-xs">Filtres</span>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="p-4 pt-0 h-[90%]">
                                    <div className="mt-6">
                                        <MenuFilters />
                                    </div>
                                    <DrawerFooter>
                                        <DrawerClose asChild>
                                            <Button>Appliquer</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuLink >
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
