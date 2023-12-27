import React from 'react'
import {Head} from '@inertiajs/react';
import {Article, PageProps, Pagination} from '@/types';
import {useInfiniteQuery} from "@tanstack/react-query";
import ArticleCard from "@/Components/article/article-card";
import ArticleCardSkeleton from "@/Components/article/article-card.skeleton";
import {useVirtualizer} from "@tanstack/react-virtual";
import {ScrollArea} from "@/Components/ui/scroll-area";

export default function Index({ }: PageProps) {

    const parentRef = React.useRef(null)

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery<Pagination<Article>>({
        queryKey: ['articles'],
        queryFn: async ({ pageParam }) => {
            const res = await fetch(route('api.articles') +'?page=' + pageParam)
            return res.json()
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

   return (
        <>
            <Head title="For the watch" />
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
        </>
    )
}
