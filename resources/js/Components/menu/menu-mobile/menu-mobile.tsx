import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/Components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/Components/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger} from "@/Components/ui/drawer";
import { MixerVerticalIcon, PersonIcon} from "@radix-ui/react-icons";
import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker";
import MenuFilters from "@/Components/menu/menu-filters/menu-filters";
import React from "react";
import ThreadListMobile from "@/Components/thread/thread-list/thread-list-mobile/thread-list-mobile";

export default function MenuMobile() {
    return (
        <div className="p-4 z-50 absolute bottom-0 left-0 right-0">
            <NavigationMenu className="max-w-full">
                <NavigationMenuList className="space-x-2">
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(navigationMenuTriggerStyle(), buttonVariants({size: "lg"}))}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <PersonIcon className="h-5 w-5" />
                                </DrawerTrigger>
                                <DrawerContent className="p-4 pt-0">
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
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(navigationMenuTriggerStyle(), buttonVariants({size: "lg"}))}
                        >
                            <ThreadListMobile />
                        </NavigationMenuLink >
                    </NavigationMenuItem>
                    <NavigationMenuItem >
                        <NavigationMenuLink
                            className={cn(navigationMenuTriggerStyle(), buttonVariants({size: "lg"}))}
                        >
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <MixerVerticalIcon className="h-5 w-5" />
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
