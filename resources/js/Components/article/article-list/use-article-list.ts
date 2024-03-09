import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import axios from "axios"
import { RefObject, useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow"

import { useDebounceValue } from "@/Hooks/use-debounce-value"
import { useFilterStore } from "@/Stores/filter-store"
import { Article, CursorPagination } from "@/types"

interface UseArticleProps {
    parentRef: RefObject<HTMLDivElement>
    cardHeight: number
    cardBottomMargin: number
    cursor?: string
}

export function useArticleList({
    parentRef,
    cardHeight,
    cardBottomMargin,
    cursor,
}: UseArticleProps) {
    const [currentFetchDirection, setCurrentFetchDirection] = useState<
        "backward" | "forward" | null
    >(null)
    const [queryKeyCache, setQueryKeyCache] = useState("")
    const [initialCursor, setInitialCursor] = useState<string | null>(
        cursor ?? null,
    )

    const { search, currentThread, showBookmark, selectedTags } =
        useFilterStore(
            useShallow((state) => ({
                search: state.search,
                currentThread: state.currentThread,
                showBookmark: state.showBookmark,
                selectedTags: state.selectedTags,
            })),
        )

    const [debouncedSearch, setDebouncedSearch] = useDebounceValue(search, 500)

    const maxPages = 3

    const infiniteProps = useInfiniteQuery<CursorPagination<Article>>({
        queryKey: [
            "articles",
            {
                tags: selectedTags,
                search: debouncedSearch,
                showBookmark,
                thread: currentThread?.id,
            },
        ],
        queryFn: async ({ pageParam, queryKey, direction }) => {
            const key = JSON.stringify(queryKey)
            let cursor = {}

            if (queryKeyCache === key || initialCursor) {
                cursor = {
                    cursor: (pageParam as string) ?? "",
                }
                setInitialCursor(null)
            }

            setQueryKeyCache(key)
            setCurrentFetchDirection(direction)

            const params = {
                ...cursor,
                "filter[title]": debouncedSearch,
                "filter[tags]": selectedTags
                    .reduce((acc, tag) => `${acc}${tag.key},`, "")
                    .slice(0, -1),
                "filter[bookmark]": showBookmark,
                "filter[thread]": currentThread?.id ?? "",
            }

            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([value]) => value !== ""),
            )

            const urlParams = new URLSearchParams(cleanParams)

            // window.history.replaceState({}, "", '?' + urlParams.toString())

            const res = await axios.get(
                `${route("api.articles")}?${urlParams.toString()}`,
            )
            return res.data
        },
        initialPageParam: initialCursor,
        getPreviousPageParam: (lastPage, pages) => lastPage.meta.prev_cursor,
        getNextPageParam: (lastPage, pages) => lastPage.meta.next_cursor,
        maxPages,
    })

    const {
        data,
        fetchPreviousPage,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
    } = infiniteProps

    const rows = data ? data.pages.flatMap((d) => d.data) : []

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? rows.length + 1 : rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => cardHeight + cardBottomMargin,
        overscan: 5,
    })

    useEffect(() => {
        setDebouncedSearch(search)
    }, [search])

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
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

        if (!lastItem) {
            return
        }

        const currentScroll = parentRef?.current?.scrollTop

        if (!currentScroll) {
            return
        }

        if (
            currentScroll + parentRef?.current?.clientHeight >
                rowVirtualizer.getTotalSize() - cardHeight * 3 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage()
        }
    }, [
        parentRef,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
    ])

    useEffect(() => {
        if (data && data.pages.length === 1) {
            parentRef?.current?.scrollTo(0, hasPreviousPage ? cardHeight : 0)
        } else if (
            currentFetchDirection === "forward" &&
            data &&
            data.pages.length === maxPages
        ) {
            setCurrentFetchDirection(null)
            parentRef?.current?.scrollTo(
                0,
                parentRef?.current?.scrollTop -
                    (cardHeight + cardBottomMargin) * 10,
            )
        } else if (currentFetchDirection === "backward") {
            setCurrentFetchDirection(null)
            parentRef?.current?.scrollTo(
                0,
                parentRef?.current?.scrollTop +
                    (cardHeight + cardBottomMargin) * 10,
            )
        }
    }, [data, currentFetchDirection])

    return { ...infiniteProps, rowVirtualizer }
}
