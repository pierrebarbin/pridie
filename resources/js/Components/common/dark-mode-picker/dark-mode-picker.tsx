import {Popover, PopoverContent, PopoverTrigger} from "@/Components/ui/popover";
import {Button} from "@/Components/ui/button";
import {useTernaryDarkMode} from "@/Hooks/use-ternary-dark-mode";
import {DesktopIcon, MoonIcon, SunIcon} from "@radix-ui/react-icons";
import {ToggleGroup, ToggleGroupItem} from "@/Components/ui/toggle-group";
import {useState} from "react";

export default function DarkModePicker() {
    const [open, setOpen] = useState(false)

    const {ternaryDarkMode, setTernaryDarkMode} = useTernaryDarkMode()

    type TernaryDarkMode = typeof ternaryDarkMode

    const onChange = (value: string) => {
        setTernaryDarkMode(value as TernaryDarkMode)
    }

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
                <ToggleGroup type="single" value={ternaryDarkMode} onValueChange={onChange}>
                    <ToggleGroupItem value="dark"><MoonIcon className="w-4 h-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="system"><DesktopIcon className="w-4 h-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="light"><SunIcon className="w-4 h-4" /></ToggleGroupItem>
                </ToggleGroup>
            </PopoverContent>
        </Popover>
    )
}
