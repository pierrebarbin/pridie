import { Head } from "@inertiajs/react"
import React, { useRef } from "react"

import ArticleList from "@/Components/article/article-list/article-list"
import Menu from "@/Components/menu/menu"
import AppLayout from "@/Layouts/app-layout"
import { createAppStore, AppContext } from "@/Stores/filter-store"
import { Config, PageProps, Tag } from "@/types"

export default function Index({
    config,
    defaultTags,
}: PageProps<{
    config: Config
    defaultTags: Tag[]
}>) {
    const store = useRef(
        createAppStore({
            defaultTags,
            selectedTags: (() => {
                return defaultTags.map((tag) => ({
                    key: tag.id,
                    value: tag.label,
                }))
            })(),
            ...config,
        }),
    ).current

    return (
        <AppContext.Provider value={store}>
            <AppLayout className="relative min-h-screen">
                <Head title="For the watch" />
                <Menu />
                <ArticleList />
            </AppLayout>
        </AppContext.Provider>
    )
}
