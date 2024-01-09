import {useTernaryDarkMode, UseTernaryDarkModeOutput} from "@/Hooks/use-ternary-dark-mode";
import {DesktopIcon, MoonIcon, SunIcon} from "@radix-ui/react-icons";
import {ToggleGroup, ToggleGroupItem} from "@/Components/ui/toggle-group";

interface DarkModePickerProps {
    useTernaryDarkModeOutput?: UseTernaryDarkModeOutput
}

export default function DarkModePicker({ useTernaryDarkModeOutput }: DarkModePickerProps) {

    const {ternaryDarkMode, setTernaryDarkMode} = useTernaryDarkModeOutput ?? useTernaryDarkMode()

    type TernaryDarkMode = typeof ternaryDarkMode

    const onChange = (value: string) => {
        setTernaryDarkMode(value as TernaryDarkMode)
    }

    return (
        <ToggleGroup type="single" value={ternaryDarkMode} onValueChange={onChange}>
            <ToggleGroupItem value="dark"><MoonIcon className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="system"><DesktopIcon className="w-4 h-4" /></ToggleGroupItem>
            <ToggleGroupItem value="light"><SunIcon className="w-4 h-4" /></ToggleGroupItem>
        </ToggleGroup>
    )
}
