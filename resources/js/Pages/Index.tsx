import React, {useState} from 'react'
import {Head} from '@inertiajs/react';
import {Article, PageProps, Pagination, Tag} from '@/types';
import {useInfiniteQuery} from "@tanstack/react-query";
import ArticleCard from "@/Components/article/article-card";
import ArticleCardSkeleton from "@/Components/article/article-card.skeleton";
import {useVirtualizer} from "@tanstack/react-virtual";
import {ScrollArea} from "@/Components/ui/scroll-area";
import TagCombobox from "@/Components/form/tag-combobox";
import {Item} from "@/Components/form/multiple-select";
import axios from "axios";
import {useDebounce} from "@/Hooks/use-debounce";

export default function Index({ tags }: PageProps<{ tags: Array<Tag> }>) {

    const selectedTags = useState<Array<Item>>([])

    const parentRef = React.useRef(null)

    const debouncedSelectedTags = useDebounce(selectedTags[0], 500)

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery<Pagination<Article>>({
        queryKey: ['articles', {tags: debouncedSelectedTags}],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams({
                "&filter[tags]": debouncedSelectedTags.reduce((acc, tag) => `${acc}${tag.key},`, '').slice(0, -1),
            });
            const tags = debouncedSelectedTags.length > 0 ? `=}` : ''
            const res = await axios.get(`${route('api.articles')}?page=${pageParam}${tags}`)
            return res.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.meta.current_page === lastPage.meta.last_page) {
                return undefined
            }

            return lastPage.meta.current_page + 1
        }
    })

    const rows = data ? data.pages.flatMap((d) => d.data) : []

    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? rows.length + 1 : rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 430,
        overscan: 5,
    })

    React.useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

        if (!lastItem) {
            return
        }

        if (
            lastItem.index >= rows.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage()
        }
    }, [
        hasNextPage,
        fetchNextPage,
        rows.length,
        isFetchingNextPage,
        rowVirtualizer.getVirtualItems(),
    ])

    const items = tags.map((tag) => ({key: tag.id, value: tag.label}))

   return (
        <div className="relative">
            <Head title="For the watch" />
            <div className="p-8 absolute left-0 top-0 bottom-0 z-10 lg:max-w-96">
                <TagCombobox data={items} selectedItems={selectedTags} />
            </div>
            {status === "pending" ? (
                <div className="h-screen mx-auto max-w-[500px]">
                    {[...Array(10).keys()].map((i) => (
                    <ArticleCardSkeleton key={i} />
                    ))}
                </div>

            ) : (
                <>
                    <ScrollArea
                        ref={parentRef}
                        className="h-screen w-full"
                    >
                        <div
                            className="relative w-full mx-auto max-w-[500px]"
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                            }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const isLoaderRow = virtualRow.index > rows.length - 1
                                const article = rows[virtualRow.index]

                                return (
                                    <div
                                        key={virtualRow.index}
                                        className="absolute top-0 left-0 w-full"
                                        style={{
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                    >
                                        {isLoaderRow ? (
                                            <ArticleCardSkeleton key={virtualRow.index} />
                                        ): (
                                            <ArticleCard key={article.id} article={article} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea >
                    {/*{!hasNextPage ? 'Tu es arrivé au bout veilleur, bravo': null}*/}
                </>
            )}
        </div>
    )
}
