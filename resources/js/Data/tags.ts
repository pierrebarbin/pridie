import axios from "axios"

export const tagsData = {
    infinite: {
        key: ({ search }: { search: string | null }) => ["tags", search],
        handle: async ({
            cursor,
            search,
        }: {
            cursor: string | null
            search: string | null
        }) => {
            const params = {
                cursor,
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
    },
}
