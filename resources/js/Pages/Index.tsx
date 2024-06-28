import { Head } from "@inertiajs/react"
import React, {useRef} from "react"

import ArticleList from "@/Components/article/article-list/article-list"
import { Item } from "@/Components/form/multiple-select"
import Menu from "@/Components/menu/menu"
import AppLayout from "@/Layouts/app-layout"
import {createFilterStore, FilterContext} from "@/Stores/filter-store"
import { PageProps, Tag, Thread } from "@/types"

export default function Index({
    filters,
    defaultTags,
}: PageProps<{
    filters: {
        cursor?: string
        filter: {
            title?: string
            bookmark?: string
            tags?: Item[]
        }
    }
    defaultTags: Tag[]
}>) {

    const store = useRef(createFilterStore({
        defaultTags,
        selectedTags: (() => {
            let selectedTags = filters.filter.tags

            if (!selectedTags || selectedTags?.length === 0) {
                selectedTags = defaultTags.map((tag) => ({
                    key: tag.id,
                    value: tag.label,
                }))
            }
            return selectedTags
        })(),
        search: filters.filter.title ?? "",
        showBookmark: filters.filter.bookmark ?? ""
    })).current

    return (
        <FilterContext.Provider value={store}>
            <AppLayout className="relative min-h-screen">
                <Head title="For the watch" />
                <Menu />
                <ArticleList />
            </AppLayout>
        </FilterContext.Provider>
    )
}
