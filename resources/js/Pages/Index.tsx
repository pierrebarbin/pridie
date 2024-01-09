import React, {useEffect} from 'react'
import {Head} from '@inertiajs/react';
import {PageProps, Tag, Thread} from '@/types';
import {Item} from "@/Components/form/multiple-select";
import AppLayout from "@/Layouts/app-layout";
import {useShallow} from "zustand/react/shallow";
import {useFilterStore} from "@/Stores/filter-store";
import Menu from "@/Components/menu/menu";
import ArticleList from "@/Components/article/article-list/article-list";

export default function Index({ tags, filters, threads }: PageProps<{
    tags: Array<Tag>
    filters: {
        cursor?: string
        filter: {
            title?: string
            bookmark?: string,
            tags?: Array<Item>
        }
    }
    threads: Array<Thread>
}>) {

    const {
        setThreads,
        updateTags,
        updateSearch,
        updateShowBookmark,
        updateSelectedTags
    } = useFilterStore(useShallow((state) => ({
        setThreads: state.setThreads,
        updateSearch: state.updateSearch,
        updateTags: state.updateTags,
        updateShowBookmark: state.updateShowBookmark,
        updateSelectedTags: state.updateSelectedTags,
    })))

    useEffect(() => {
        setThreads(threads)
        updateTags(tags)
        updateSearch(filters.filter.title ?? "")
        updateShowBookmark(filters.filter.bookmark ?? "yes")
        updateSelectedTags(filters.filter.tags ?? [])
    }, [])

   return (
        <AppLayout className="relative min-h-screen">
            <Head title="For the watch" />
            <Menu />
            <ArticleList cursor={filters.cursor} />
        </AppLayout>
    )
}
