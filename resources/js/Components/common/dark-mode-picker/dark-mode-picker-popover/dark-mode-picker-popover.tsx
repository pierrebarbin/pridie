import {Popover, PopoverContent, PopoverTrigger} from "@/Components/ui/popover";
import {Button} from "@/Components/ui/button";
import {DesktopIcon, MoonIcon, SunIcon} from "@radix-ui/react-icons";
import {useState} from "react";
import {useTernaryDarkMode} from "@/Hooks/use-ternary-dark-mode";
import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker";


export default function DarkModePickerPopover() {
    const [open, setOpen] = useState(false)

    const ternaryProps = useTernaryDarkMode()

    const {ternaryDarkMode} = ternaryProps

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={open ? "secondary" : "ghost"}>
                    {ternaryDarkMode === "dark" ? (
                        <MoonIcon className="w-4 h-4" />
                    ): null}
                    {ternaryDarkMode === "light" ? (
                        <SunIcon className="w-4 h-4" />
                    ): null}
                    {ternaryDarkMode === "system" ? (
                        <DesktopIcon className="w-4 h-4" />
                    ): null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-1">
                <DarkModePicker useTernaryDarkModeOutput={ternaryProps} />
            </PopoverContent>
        </Popover>
    )
}
