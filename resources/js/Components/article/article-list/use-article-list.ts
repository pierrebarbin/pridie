import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import axios from "axios"
import {RefObject, useEffect, useLayoutEffect, useState} from "react"
import { useShallow } from "zustand/react/shallow"

import { useDebounceValue } from "@/Hooks/use-debounce-value"
import { useFilterStore } from "@/Stores/filter-store"
import { Article, CursorPagination } from "@/types"

interface UseArticleProps {
    parentRef: RefObject<HTMLDivElement>
    cardHeight: number
    cardBottomMargin: number
}

const maxPages = 3
const cardPerPage = 10

export function useArticleList({
    parentRef,
    cardHeight,
    cardBottomMargin,
}: UseArticleProps) {
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
        queryFn: async ({ pageParam}) => {
            const param = pageParam as {cursor: string|null, direction: "backward"|"forward"|null}

            const params = {
                cursor: param.cursor,
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

            const res = await axios.get(
                `${route("api.articles")}?${urlParams.toString()}`,
            )
            return res.data
        },
        initialPageParam: ({
            cursor: null,
            direction: null,
        }),

        getPreviousPageParam: (lastPage, pages) => (lastPage.meta.prev_cursor ? {
            cursor: lastPage.meta.prev_cursor,
            direction: "backward",
        }: null),
        getNextPageParam: (lastPage, pages) => ( lastPage.meta.next_cursor ? {
            cursor: lastPage.meta.next_cursor,
            direction: "forward",
        }: null),
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
        isRefetching
    } = infiniteProps
console.log(infiniteProps)
    const rows = data ? data.pages.flatMap((d) => d.data) : []

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? rows.length + 1 : rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => cardHeight + cardBottomMargin,
        overscan: 5,
    })

    const topMargin = hasPreviousPage
        ? cardHeight + cardBottomMargin
        : cardBottomMargin
    const containerHeight = rowVirtualizer.getTotalSize() + topMargin

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
        const param = data?.pageParams[0] as {cursor: string|null, direction: "backward"|"forward"|null}|null

        if (data && data.pages.length === 1 && param?.direction === null) {
            parentRef?.current?.scrollTo(0, hasPreviousPage ? cardHeight : 0)
            return
        }

        if (
            data &&
            data.pages.length === maxPages &&
            param?.direction === "forward" &&
            !isRefetching
        ) {
            parentRef?.current?.scrollTo(
                0,
                containerHeight -
                    (cardHeight + cardBottomMargin) * (cardPerPage * 2 - 5.5), // need to change that magic number to some variables + handle last page without max card
            )
            return
        }

        if (param?.direction === "backward" && !isRefetching) {
            parentRef?.current?.scrollTo(
                0,
                parentRef?.current?.scrollTop +
                    (cardHeight + cardBottomMargin) * (cardPerPage * 2 - 1),
            )
            return
        }
    }, [data, isRefetching])

    return { ...infiniteProps, rowVirtualizer, containerHeight, topMargin }
}
