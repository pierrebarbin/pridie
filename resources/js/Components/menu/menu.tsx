import { router, usePage } from "@inertiajs/react"
import Avatar from "boring-avatars"

import DarkModePickerPopover from "@/Components/common/dark-mode-picker/dark-mode-picker-popover/dark-mode-picker-popover"
import ConfigModal from "@/Components/config/config-modal/config-modal"
import MenuFilters from "@/Components/menu/menu-filters/menu-filters"
import MenuMobile from "@/Components/menu/menu-mobile/menu-mobile"
import ThreadList from "@/Components/thread/thread-list/thread-list"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { useIsMobileBreakpoint } from "@/Hooks/use-media-query"
import { User } from "@/types"

import ProfileModal from "../profile/profile-modal/profile-modal"

export default function Menu() {
    const { user } = usePage().props.auth as unknown as { user: User }
    const { isMobile } = useIsMobileBreakpoint()

    if (isMobile) {
        return <MenuMobile />
    }

    return (
        <>
            <div className="absolute left-0 top-0 z-10 p-8 lg:w-80">
                <MenuFilters />
            </div>
            <div className="absolute bottom-0 left-0 z-10 p-8">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="flex items-center gap-2 rounded border border-border p-2 lg:w-48">
                            <Avatar
                                size={40}
                                name={user.name}
                                variant="beam"
                                colors={[
                                    "#595B5A",
                                    "#14C3A2",
                                    "#0DE5A8",
                                    "#7CF49A",
                                    "#B8FD99",
                                ]}
                            />
                            <span className="truncate">{user.name}</span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ProfileModal>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                Profil
                            </DropdownMenuItem>
                        </ProfileModal>
                        <ConfigModal>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                Config
                            </DropdownMenuItem>
                        </ConfigModal>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={(e) => router.post(route("logout"))}
                        >
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="absolute right-0 top-0 z-10 flex flex-col items-end p-8 lg:w-40">
                <DarkModePickerPopover />
                <ThreadList />
            </div>
        </>
    )
}
