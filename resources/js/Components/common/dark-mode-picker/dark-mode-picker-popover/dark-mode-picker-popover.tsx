import React, { useState } from "react"

import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker"
import { Button } from "@/Components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { useTernaryDarkMode } from "@/Hooks/use-ternary-dark-mode"
import {Monitor, Moon, Sun} from "lucide-react";

export default function DarkModePickerPopover() {
    const [open, setOpen] = useState(false)

    const ternaryProps = useTernaryDarkMode()

    const { ternaryDarkMode } = ternaryProps

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={open ? "secondary" : "ghost"}>
                    {ternaryDarkMode === "dark" ? (
                        <Moon className="h-4 w-4" />
                    ) : null}
                    {ternaryDarkMode === "light" ? (
                        <Sun className="h-4 w-4" />
                    ) : null}
                    {ternaryDarkMode === "system" ? (
                        <Monitor className="h-4 w-4" />
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-1">
                <DarkModePicker useTernaryDarkModeOutput={ternaryProps} />
            </PopoverContent>
        </Popover>
    )
}
