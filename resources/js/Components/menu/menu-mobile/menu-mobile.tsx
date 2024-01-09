import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/Components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/Components/ui/button";
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger} from "@/Components/ui/drawer";
import {BookmarkIcon, MixerVerticalIcon, PersonIcon} from "@radix-ui/react-icons";
import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker";
import MenuFilters from "@/Components/menu/menu-filters/menu-filters";
import React from "react";

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
                                <DrawerContent className="p-4">
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
                            <Drawer shouldScaleBackground>
                                <DrawerTrigger asChild>
                                    <BookmarkIcon className="h-5 w-5" />
                                </DrawerTrigger>
                                <DrawerContent className="p-4 h-[90%]">
                                    <div className="mt-6">
                                        {/*<ThreadList />*/}
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuLink >
                    </NavigationMenuItem>
                    <NavigationMenuItem >
                        <NavigationMenuLink
                            className={cn(navigationMenuTriggerStyle(), buttonVariants({size: "lg"}))}
                        >
                            <Drawer shouldScaleBackground>
                                <DrawerTrigger asChild>
                                    <MixerVerticalIcon className="h-5 w-5" />
                                </DrawerTrigger>
                                <DrawerContent className="p-4 h-[90%]">
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
