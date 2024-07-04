import "./bootstrap"
import "../css/app.css"

import { createInertiaApp } from "@inertiajs/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"
import React from "react"
import { createRoot } from "react-dom/client"

import { Toaster } from "@/Components/ui/sonner"

const appName = import.meta.env.VITE_APP_NAME || "Laravel"

export const queryClient = new QueryClient()

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el)

        root.render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
                <Toaster richColors closeButton />
            </QueryClientProvider>,
        )
    },
    progress: false,
})
