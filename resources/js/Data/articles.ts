import {Item} from "@/Components/form/multiple-select";
import axios from "axios";

export const articlesData = {
    infinite: {
        key: ({ tags, search, showBookmark, thread }: {
            tags: Item[],
            search: string,
            showBookmark: string,
            thread: string|undefined
        }) => [
            "articles",
            {
                tags,
                search,
                showBookmark,
                thread,
            },
        ],
        handle: async ({pageParam, tags, search, showBookmark, thread}: {
            pageParam: {cursor: string|null},
            tags: Item[],
            search: string,
            showBookmark: string,
            thread: string|undefined
        }) => {
            const param = pageParam as {cursor: string|null}

            const params = {
                cursor: param.cursor,
                "filter[title]": search,
                "filter[tags]": tags
                    .reduce((acc, tag) => `${acc}${tag.key},`, "")
                    .slice(0, -1),
                "filter[bookmark]": showBookmark,
                "filter[thread]": thread ?? "",
            }

            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([value]) => value !== ""),
            ) as Record<string, string>

            const urlParams = new URLSearchParams(cleanParams)

            const res = await axios.get(
                `${route("api.articles")}?${urlParams.toString()}`,
            )
            return res.data
        }
    }
}
