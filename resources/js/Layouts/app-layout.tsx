import {useTernaryDarkMode} from "@/Hooks/use-ternary-dark-mode";
import {PropsWithChildren, useEffect} from "react";
import {cn} from "@/lib/utils";

interface AppLayoutProps extends PropsWithChildren {
    className?: string
}

export default function AppLayout({ children, className }: AppLayoutProps) {
    const { isDarkMode } = useTernaryDarkMode()

    useEffect(() => {
        const body = document.querySelector('body')

        if (body) {
            isDarkMode ? body.classList.add('dark') : body.classList.remove('dark')
        }
    }, [isDarkMode])

    return (
        <div className={cn(className)}>
            {children}
        </div>
    )
}
