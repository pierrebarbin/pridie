import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {CursorPagination, Thread} from "@/types";
import {threadsData} from "@/Data/threads";
import {UIEvent} from "react";

interface UseThreadsProps {
    search: string
}

export function useThreads({search}: UseThreadsProps) {
     const {
         data,
         hasNextPage,
         isFetchingNextPage,
         fetchNextPage,
         ...rest
     } = useSuspenseInfiniteQuery<CursorPagination<Thread>>({
        queryKey: threadsData.infinite.key({search}),
        queryFn: async ({ pageParam }) => {
            return await threadsData.infinite.handle({cursor: pageParam as string, search})
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    })

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLUListElement
        const bottom =
            target.scrollHeight - target.scrollTop < target.clientHeight + 20

        if (bottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    const rows = data ? data.pages.flatMap((d) => d.data) : []

    return {data, rows, hasNextPage, isFetchingNextPage, fetchNextPage, handleScroll, ...rest }
}
