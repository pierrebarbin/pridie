import { House, Settings, SlidersVertical } from "lucide-react"

import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker"
import ConfigDefaultTags from "@/Components/config/config-default-tags/config-default-tags"
import MenuFilters from "@/Components/menu/menu-filters/menu-filters"
import ProfileDrawer from "@/Components/profile/profile-drawer/profile-drawer"
import ThreadListDrawer from "@/Components/thread/thread-list/thread-list-drawer/thread-list-drawer"
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
import { useAppStoreContext } from "@/Stores/use-app-store"

export default function MenuMobile() {
    const removeCurrentThread = useAppStoreContext(
        (state) => state.removeCurrentThread,
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
                                        <Settings className="h-5 w-5" />
                                        <span className="text-xs">Config</span>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="h-[90%] p-4 pt-0">
                                    <div className="mt-6">
                                        <DarkModePicker />
                                    </div>
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
                            <ProfileDrawer />
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
                                <House className="h-5 w-5" />
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
                            <ThreadListDrawer />
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
                                        <SlidersVertical className="h-5 w-5" />
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
