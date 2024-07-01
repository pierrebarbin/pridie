import {useInfiniteQuery} from "@tanstack/react-query";
import {CursorPagination, Tag} from "@/types";
import axios from "axios";

interface UseTagsProps {
    search: string|null
}

export function useTags ({ search }: UseTagsProps) {
        return useInfiniteQuery<CursorPagination<Tag>>({
            queryKey: ["tags", { search }],
            queryFn: async ({ pageParam }) => {
                const params = {
                    cursor: pageParam as string,
                    "filter[label]": search,
                }

                const cleanParams = Object.fromEntries(
                    Object.entries(params).filter(([value]) => value !== ""),
                ) as Record<string, string>

                const urlParams = new URLSearchParams(cleanParams)

                const result = await axios.get(
                    `${route("api.tags")}?${urlParams.toString()}`,
                )

                return result.data
            },
            initialPageParam: null,
            getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
        })
}
