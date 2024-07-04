export const reactionsData = {
    pagination: {
        key: ({ page }: { page: number }) => ["reactions", page],
        handle: async ({ page }: { page: number }) => {
            return await window.axios
                .get(route("api.reactions"))
                .then((res) => res.data)
        },
    },
}
