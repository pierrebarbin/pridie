export const threadsData = {
    pagination: {
        key: ({page}: { page: number }) => ['threads', page],
        handle: async ({page}: { page: number }) => {
            return window.axios
                .get(route("api.threads"),)
                .then((res) => res.data)
        }
    }
}
