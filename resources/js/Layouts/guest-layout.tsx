import { PropsWithChildren } from "react"

import AppLayout from "@/Layouts/app-layout"

export default function Guest({ children }: PropsWithChildren) {
    return (
        <AppLayout className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <main>{children}</main>
        </AppLayout>
    )
}
