import React, {useEffect, useState} from 'react'
import {Head} from '@inertiajs/react';
import {Article, CursorPagination, PageProps, Pagination, Tag} from '@/types';
import {useInfiniteQuery} from "@tanstack/react-query";
import ArticleCard from "@/Components/article/article-card";
import ArticleCardSkeleton from "@/Components/article/article-card.skeleton";
import {useVirtualizer} from "@tanstack/react-virtual";
import {ScrollArea} from "@/Components/ui/scroll-area";
import TagCombobox from "@/Components/form/tag-combobox";
import {Item} from "@/Components/form/multiple-select";
import axios from "axios";
import {useDebounce} from "@/Hooks/use-debounce";
import {Input} from "@/Components/ui/input";
import {Label} from "@/Components/ui/label";
import {Separator} from "@/Components/ui/separator";
import {ToggleGroup, ToggleGroupItem} from "@/Components/ui/toggle-group";

export default function Index({ tags, filters }: PageProps<{
    tags: Array<Tag>
    filters: {
        cursor?: string
        filter: {
            title?: string
            bookmark?: string,
            tags?: Array<Item>
        }
    }
}>) {

    const [queryKeyCache, setQueryKeyCache] = useState("")
    const [initialCursor, setInitialCursor] = useState<string|null>(filters.cursor ?? null)
    const [search, setSearch] = useState(filters.filter.title ?? "")
    const [showBookmark, setShowBookmark] = useState(filters.filter.bookmark ?? "yes")
    const selectedTags = useState<Array<Item>>(filters.filter.tags ?? [])

    const parentRef = React.useRef<HTMLDivElement>(null)

    const debouncedSelectedTags = useDebounce(selectedTags[0], 500)
    const debouncedSearch = useDebounce(search, 500)

    const {
        data,
        error,
        fetchPreviousPage,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
        isFetching,
        isFetchingNextPage,
        isFetchingPreviousPage,
        status
    } = useInfiniteQuery<CursorPagination<Article>>({
        queryKey: ['articles', {tags: debouncedSelectedTags, search: debouncedSearch, showBookmark}],
        queryFn: async ({ pageParam, queryKey }) => {
            const key = JSON.stringify(queryKey)
            let cursor = {}

            if (queryKeyCache === key || initialCursor) {
                cursor = {
                    "cursor": (pageParam as string) ?? "",
                }
                setInitialCursor(null)
            }

            setQueryKeyCache(key)

            const params = {
                ...cursor,
                "filter[title]": debouncedSearch,
                "filter[tags]": debouncedSelectedTags.reduce((acc, tag) => `${acc}${tag.key},`, '').slice(0, -1),
                "filter[bookmark]": showBookmark
            }

            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([key, value]) => value !== '')
            )

            const urlParams = new URLSearchParams(cleanParams);

            window.history.replaceState({}, "", '?' + urlParams.toString())

            const res = await axios.get(`${route('api.articles')}?${urlParams.toString()}`)
            return res.data
        },
        initialPageParam: initialCursor,
        getPreviousPageParam: (lastPage, pages) => lastPage.meta.prev_cursor,
        getNextPageParam: (lastPage, pages) => lastPage.meta.next_cursor
    })

    const rows = data ? data.pages.flatMap((d) => d.data) : []

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? rows.length + 1 : rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 430,
        overscan: 5,
    })

    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

        if (!lastItem) {
            return
        }

        if (
            lastItem.index >= rows.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage()
        }
    }, [
        hasNextPage,
        fetchNextPage,
        rows.length,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
    ])

    useEffect(() => {
        const firstItem = rowVirtualizer.getVirtualItems()[0]

        if (!firstItem) {
            return
        }

        const currentScroll = parentRef?.current?.scrollTop

        if (!currentScroll) {
            return
        }

        if (
            currentScroll < 100 &&
            hasPreviousPage &&
            !isFetchingPreviousPage
        ) {
            fetchPreviousPage()
        }
    }, [
        parentRef,
        hasNextPage,
        fetchPreviousPage,
        isFetchingPreviousPage,
        rowVirtualizer.getVirtualItems(),
    ])

    useEffect(() => {
        if (data && data.pages.length === 1) {
            parentRef?.current?.scrollTo(0, 100)
        } else {
            parentRef?.current?.scrollTo(0, parentRef?.current?.scrollTop + 430 * 10)
        }
    }, [data])

    const items = tags.map((tag) => ({key: tag.id, value: tag.label}))

   return (
        <div className="relative">
            <Head title="For the watch" />
            <div className="p-8 absolute left-0 top-0 bottom-0 z-10 lg:w-80 space-y-4">
                <div>
                    <Label htmlFor="search">Titre</Label>
                    <Input
                        id="search"
                        className="mt-2"
                        placeholder="Rechercher un titre..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />
                </div>
                <Separator />
                <TagCombobox data={items} selectedItems={selectedTags} />
                <Separator />
                <div>
                    <Label>Afficher les articles ajoutés à ma veille</Label>
                    <ToggleGroup
                        type="single"
                        className="m-2 gap-2 w-fit"
                        defaultValue="yes"
                        value={showBookmark}
                        onValueChange={setShowBookmark}
                    >
                        <ToggleGroupItem variant="outline" value="yes" aria-label="Afficher les articles ajoutés à ma veille">
                            Oui
                        </ToggleGroupItem>
                        <ToggleGroupItem variant="outline" value="no" aria-label="Cacher les articles ajoutés à ma veille">
                            Non
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

            </div>
            {status === "pending" ? (
                <div className="h-screen mx-auto max-w-[500px]">
                    {[...Array(10).keys()].map((i) => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    <ScrollArea
                        ref={parentRef}
                        className="h-screen w-full"
                    >
                        <div
                            className="relative w-full mx-auto max-w-[500px]"
                            style={{
                                height: `${rowVirtualizer.getTotalSize() + 100}px`,
                            }}
                        >
                            <div className="h-[100px] top-0 w-full absolute">

                            </div>
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const isLoaderRow = virtualRow.index > rows.length - 1
                                const article = rows[virtualRow.index]

                                return (
                                    <div
                                        key={virtualRow.index}
                                        className="absolute top-0 left-0 w-full"
                                        style={{
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start + 100}px)`,
                                        }}
                                    >
                                        {isLoaderRow ? (
                                            <ArticleCardSkeleton key={virtualRow.index} />
                                        ): (
                                            <ArticleCard key={article.id} article={article} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea >
                    {/*{!hasNextPage ? 'Tu es arrivé au bout veilleur, bravo': null}*/}
                </>
            )}
        </div>
    )
}
