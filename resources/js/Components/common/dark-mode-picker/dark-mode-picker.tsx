import { Monitor, Moon, Sun } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group"
import {
    useTernaryDarkMode,
    TernaryDarkModeResult,
} from "@/Hooks/use-ternary-dark-mode"

interface DarkModePickerProps {
    useTernaryDarkModeOutput?: TernaryDarkModeResult
}

export default function DarkModePicker({
    useTernaryDarkModeOutput,
}: DarkModePickerProps) {
    const { ternaryDarkMode, setTernaryDarkMode } =
        useTernaryDarkModeOutput ?? useTernaryDarkMode()

    type TernaryDarkMode = typeof ternaryDarkMode

    const onChange = (value: string) => {
        setTernaryDarkMode(value as TernaryDarkMode)
    }

    return (
        <ToggleGroup
            type="single"
            value={ternaryDarkMode}
            onValueChange={onChange}
        >
            <ToggleGroupItem value="dark">
                <Moon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="system">
                <Monitor className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="light">
                <Sun className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    )
}
