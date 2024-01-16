import MenuFilters from "@/Components/menu/menu-filters/menu-filters";
import DarkModePickerPopover
    from "@/Components/common/dark-mode-picker/dark-mode-picker-popover/dark-mode-picker-popover";
import ThreadList from "@/Components/thread/thread-list/thread-list";
import React from "react";
import {useIsMobileBreakpoint} from "@/Hooks/use-media-query";
import MenuMobile from "@/Components/menu/menu-mobile/menu-mobile";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu";
import Avatar from 'boring-avatars';
import {router, usePage} from "@inertiajs/react";
import {User} from "@/types";

export default function Menu() {

    const {user} = usePage().props.auth as unknown as {user: User}
    const {isMobile} = useIsMobileBreakpoint()

    if (isMobile) {
        return <MenuMobile />
    }

    return (
        <>
            <div className="p-8 absolute left-0 top-0 z-10 lg:w-80">
                <MenuFilters />
            </div>
            <div className="p-8 absolute left-0 bottom-0 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="p-2 flex gap-2 items-center border border-border rounded lg:w-48">
                            <Avatar
                                size={40}
                                name={user.name}
                                variant="beam"
                                colors={['#595B5A', '#14C3A2', '#0DE5A8', '#7CF49A', '#B8FD99']}
                            />
                            <span className="truncate">{user.name}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Mon compte
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profil</DropdownMenuItem>
                        <DropdownMenuItem>Config</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => router.post(route('logout'))}>
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="p-8 absolute right-0 top-0 z-10 lg:w-40 flex flex-col items-end">
                <DarkModePickerPopover />
                <ThreadList />
            </div>
        </>
    )
}
