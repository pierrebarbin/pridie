import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import ArticleList from "@/Components/article/article-list/article-list";
import { Item } from "@/Components/form/multiple-select";
import Menu from "@/Components/menu/menu";
import AppLayout from "@/Layouts/app-layout";
import { useFilterStore } from "@/Stores/filter-store";
import { PageProps, Tag, Thread } from "@/types";

export default function Index({
    tags,
    filters,
    threads,
    defaultTags,
}: PageProps<{
    tags: Tag[];
    filters: {
        cursor?: string;
        filter: {
            title?: string;
            bookmark?: string;
            tags?: Item[];
        };
    };
    threads: Thread[];
    defaultTags: Tag[];
}>) {
    const {
        setThreads,
        updateTags,
        updateSearch,
        updateShowBookmark,
        updateSelectedTags,
        updateDefaultTags,
    } = useFilterStore(
        useShallow((state) => ({
            setThreads: state.setThreads,
            updateSearch: state.updateSearch,
            updateTags: state.updateTags,
            updateShowBookmark: state.updateShowBookmark,
            updateSelectedTags: state.updateSelectedTags,
            updateDefaultTags: state.updateDefaultTags,
        })),
    );

    useEffect(() => {
        updateTags(tags);
        updateSearch(filters.filter.title ?? "");
        updateShowBookmark(filters.filter.bookmark ?? "yes");
    }, []);

    useEffect(() => {
        setThreads(threads);
    }, [threads]);

    useEffect(() => {
        let selectedTags = filters.filter.tags;

        if (!selectedTags || selectedTags?.length === 0) {
            selectedTags = defaultTags.map((tag) => ({
                key: tag.id,
                value: tag.label,
            }));
        }

        updateSelectedTags(selectedTags);
        updateDefaultTags(defaultTags);
    }, [defaultTags, filters.filter.tags]);

    return (
        <AppLayout className="relative min-h-screen">
            <Head title="For the watch" />
            <Menu />
            <ArticleList cursor={filters.cursor} />
        </AppLayout>
    );
}
