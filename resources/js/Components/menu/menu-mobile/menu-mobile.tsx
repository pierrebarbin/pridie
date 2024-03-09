import {
    GearIcon,
    HomeIcon,
    MixerVerticalIcon,
    PersonIcon,
} from "@radix-ui/react-icons"
import React from "react"
import { useShallow } from "zustand/react/shallow"

import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker"
import ConfigDefaultTags from "@/Components/config/config-default-tags/config-default-tags"
import MenuFilters from "@/Components/menu/menu-filters/menu-filters"
import ThreadListMobile from "@/Components/thread/thread-list/thread-list-mobile/thread-list-mobile"
import { Button, buttonVariants } from "@/Components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from "@/Components/ui/drawer"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu"
import { useMediaQuery } from "@/Hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useFilterStore } from "@/Stores/filter-store"

export default function MenuMobile() {
    const { removeCurrentThread } = useFilterStore(
        useShallow((state) => ({
            removeCurrentThread: state.removeCurrentThread,
        })),
    )

    const matches = useMediaQuery("(min-width: 360px)")

    return (
        <div className="fixed bottom-[15px] left-[50%] z-50 -translate-x-1/2 rounded-lg bg-secondary p-2 shadow">
            <NavigationMenu className="max-w-full">
                <NavigationMenuList className="space-x-3">
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({ variant: "secondary" }),
                                "h-auto flex-col gap-1",
                            )}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <div className="flex flex-col items-center gap-1">
                                        <GearIcon className="h-5 w-5" />
                                        <span className="text-xs">Config</span>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="h-[90%] p-4 pt-0">
                                    <div className="mt-4">
                                        <ConfigDefaultTags />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({ variant: "secondary" }),
                                "h-auto",
                            )}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <div className="flex flex-col items-center gap-1">
                                        <PersonIcon className="h-5 w-5" />
                                        <span className="text-xs">Profil</span>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="h-1/3 p-4 pt-0">
                                    <div className="mt-6">
                                        <DarkModePicker />
                                    </div>
                                    <DrawerFooter>
                                        <form
                                            action={route("logout")}
                                            method="post"
                                        >
                                            <Button
                                                variant="destructive"
                                                className="w-full"
                                            >
                                                Déconnexion
                                            </Button>
                                        </form>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {matches ? (
                        <NavigationMenuItem className="w-full">
                            <NavigationMenuLink
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    buttonVariants(),
                                    "h-auto rounded-full px-3 py-3 shadow-none",
                                )}
                                onSelect={() => {
                                    removeCurrentThread()
                                }}
                            >
                                <HomeIcon className="h-5 w-5" />
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ) : null}
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({ variant: "secondary" }),
                                "h-auto flex-col gap-1",
                            )}
                        >
                            <ThreadListMobile />
                            <span className="text-xs">Flux</span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                buttonVariants({ variant: "secondary" }),
                                "h-auto",
                            )}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <div className="flex flex-col items-center gap-1">
                                        <MixerVerticalIcon className="h-5 w-5" />
                                        <span className="text-xs">Filtres</span>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="h-[90%] p-4 pt-0">
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
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
