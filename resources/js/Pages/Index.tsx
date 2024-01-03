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
import {ArchiveIcon, Cross2Icon, HamburgerMenuIcon} from "@radix-ui/react-icons";
import {Button} from "@/Components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/Components/ui/sheet";
import {useMediaQuery} from "@/Hooks/use-media-query";
import ArticleFilters from "@/Components/article/article-filters";

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
    const [currentFetchDirection, setCurrentFetchDirection] = useState<"backward"|"forward">("forward")
    const [queryKeyCache, setQueryKeyCache] = useState("")
    const [initialCursor, setInitialCursor] = useState<string|null>(filters.cursor ?? null)
    const [search, setSearch] = useState(filters.filter.title ?? "")
    const [showBookmark, setShowBookmark] = useState(filters.filter.bookmark ?? "yes")
    const selectedTags = useState<Array<Item>>(filters.filter.tags ?? [])

    const parentRef = React.useRef<HTMLDivElement>(null)

    const debouncedSelectedTags = useDebounce(selectedTags[0], 500)
    const debouncedSearch = useDebounce(search, 500)
    const matches = useMediaQuery('(min-width: 1130px)')

    const {
        data,
        error,
        fetchPreviousPage,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
        status,
    } = useInfiniteQuery<CursorPagination<Article>>({
        queryKey: ['articles', {tags: debouncedSelectedTags, search: debouncedSearch, showBookmark}],
        queryFn: async ({ pageParam, queryKey, direction }) => {

            const key = JSON.stringify(queryKey)
            let cursor = {}

            if (queryKeyCache === key || initialCursor) {
                cursor = {
                    "cursor": (pageParam as string) ?? "",
                }
                setInitialCursor(null)
            }

            setQueryKeyCache(key)
            setCurrentFetchDirection(direction)

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
    const cardHeight = 400
    const cardBottomMargin = 30

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? rows.length + 1 : rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => cardHeight + cardBottomMargin,
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
            currentScroll < cardHeight &&
            hasPreviousPage &&
            !isFetchingPreviousPage &&
            currentFetchDirection !== "backward"
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
            parentRef?.current?.scrollTo(0, hasPreviousPage ? cardHeight : 0)
        } else if (currentFetchDirection === "backward") {
            setCurrentFetchDirection("forward")
            parentRef?.current?.scrollTo(0, parentRef?.current?.scrollTop + (cardHeight + cardBottomMargin) * 10)
        }
    }, [data, currentFetchDirection])

    const resetFilters = () => {
        selectedTags[1]([])
        setSearch("")
    }

    const items = tags.map((tag) => ({key: tag.id, value: tag.label}))
    const topMargin = hasPreviousPage ? cardHeight + cardBottomMargin : cardBottomMargin

   return (
        <div className="relative">
            <Head title="For the watch" />
            {!matches ? (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="absolute rounded-full right-[30px] bottom-[30px] z-40">
                            <HamburgerMenuIcon className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-11/12">
                        <SheetHeader>
                            <SheetDescription>
                                <ArticleFilters
                                    items={items}
                                    search={search}
                                    setSearch={setSearch}
                                    selectedTags={selectedTags}
                                    setShowBookmark={setShowBookmark}
                                    showBookmark={showBookmark}
                                />
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            ): (
                <div className="p-8 absolute left-0 top-0 bottom-0 z-10 lg:w-80">
                    <ArticleFilters
                        items={items}
                        search={search}
                        setSearch={setSearch}
                        selectedTags={selectedTags}
                        setShowBookmark={setShowBookmark}
                        showBookmark={showBookmark}
                    />
                </div>
            )}
            {status === "pending" ? (
                <div className="h-screen mx-auto max-w-[500px]">
                    {[...Array(10).keys()].map((i) => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </div>
            ) :  rows.length === 0 ? (
                    <div className="text-center pt-20">
                        <ArchiveIcon className="mx-auto h-12 w-12" />
                        <h3 className="mt-2 text-sm font-semibold">Aucun article</h3>
                        <p className="mt-1 text-sm text-gray-500">Recherchez avec d'autres critères.</p>
                        <div className="mt-6">
                            <Button type="button" className="gap-2" onClick={resetFilters}>
                                <Cross2Icon className="w-4 h-4"/>
                               Retirer les filtres
                            </Button>
                        </div>
                    </div>
                ): (
                    <ScrollArea
                        ref={parentRef}
                        className="h-screen w-full"
                    >
                        <div
                            className="relative w-full mx-auto max-w-[500px]"
                            style={{
                                height: `${rowVirtualizer.getTotalSize() + cardHeight + cardBottomMargin}px`,
                            }}
                        >
                            {hasPreviousPage ? (
                                <div className="top-0 w-full absolute">
                                    <ArticleCardSkeleton />
                                </div>
                            ): null}

                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const isLoaderRow = virtualRow.index > rows.length - 1
                                const article = rows[virtualRow.index]

                                return (
                                    <div
                                        key={virtualRow.index}
                                        className="absolute top-0 left-0 w-full"
                                        style={{
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start + topMargin}px)`,
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
                )
            }
                {/*{!hasNextPage ? 'Tu es arrivé au bout veilleur, bravo': null}*/}
        </div>
    )
}
