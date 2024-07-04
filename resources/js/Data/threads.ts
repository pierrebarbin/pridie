import axios from "axios"

export const threadsData = {
    infinite: {
        key: ({ search }: { search: string | null }) => ["threads", search],
        handle: async ({
            cursor,
            search,
        }: {
            cursor: string | null
            search: string | null
        }) => {
            const params = {
                cursor,
                "filter[name]": search,
            }

            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([value]) => value !== ""),
            ) as Record<string, string>

            const urlParams = new URLSearchParams(cleanParams)

            const result = await axios.get(
                `${route("api.threads")}?${urlParams.toString()}`,
            )

            return result.data
        },
    },
}
