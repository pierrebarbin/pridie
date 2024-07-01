import {useInfiniteQuery} from "@tanstack/react-query";
import {CursorPagination, Tag} from "@/types";
import {tagsData} from "@/Data/tags";

interface UseTagsProps {
    search: string|null
}

export function useTags ({ search }: UseTagsProps) {
    return useInfiniteQuery<CursorPagination<Tag>>({
        queryKey: tagsData.infinite.key({search}),
        queryFn: async ({ pageParam }) => {
            return await tagsData.infinite.handle({cursor: pageParam as string, search})
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    })
}
