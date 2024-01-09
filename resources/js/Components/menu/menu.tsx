import MenuFilters from "@/Components/menu/menu-filters/menu-filters";
import DarkModePickerPopover
    from "@/Components/common/dark-mode-picker/dark-mode-picker-popover/dark-mode-picker-popover";
import ThreadList from "@/Components/thread/thread-list/thread-list";
import React from "react";
import {useIsMobileBreakpoint} from "@/Hooks/use-media-query";
import MenuMobile from "@/Components/menu/menu-mobile/menu-mobile";

export default function Menu() {

    const {isMobile} = useIsMobileBreakpoint()

    if (isMobile) {
        return <MenuMobile />
    }

    return (
        <>
            <div className="p-8 absolute left-0 top-0 z-10 lg:w-80">
                <MenuFilters />
            </div>
            <div className="p-8 absolute right-0 top-0 z-10 lg:w-40 flex flex-col items-end">
                <DarkModePickerPopover />
                <ThreadList />
            </div>
        </>
    )
}
