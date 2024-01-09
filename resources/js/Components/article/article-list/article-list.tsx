import React from "react";
import {useFilterStore} from "@/Stores/filter-store";
import {useShallow} from "zustand/react/shallow";
import ArticleCardSkeleton from "@/Components/article/article-card/article-card.skeleton";
import {ArchiveIcon, Cross2Icon} from "@radix-ui/react-icons";
import {Button} from "@/Components/ui/button";
import {ScrollArea} from "@/Components/ui/scroll-area";
import ArticleCard from "@/Components/article/article-card/article-card";
import {useArticleList} from "@/Components/article/article-list/use-article-list";

interface ArticleListProps {
    cursor?: string
}

export default function ArticleList({cursor}: ArticleListProps) {

    const parentRef = React.useRef<HTMLDivElement>(null)

    const {
        currentThread,
        resetFilters
    } = useFilterStore(useShallow((state) => ({
        currentThread: state.currentThread,
        resetFilters: state.resetFilters,
    })))

    const cardHeight = 400
    const cardBottomMargin = 30

    const {
        data,
        error,
        status,
        hasPreviousPage,
        rowVirtualizer
    } = useArticleList({
        cursor,
        parentRef,
        cardBottomMargin,
        cardHeight
    })

    const rows = data ? data.pages.flatMap((d) => d.data) : []
    const topMargin = hasPreviousPage ? cardHeight + cardBottomMargin : cardBottomMargin

    if (status === "pending") {
        return (
            <div className="h-screen mx-auto max-w-[500px]">
                {[...Array(10).keys()].map((i) => (
                    <div style={{marginTop: cardBottomMargin}} key={i}>
                        <ArticleCardSkeleton />
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center pt-20">
                <Cross2Icon className="text-destructive mx-auto h-12 w-12" />
                <h3 className="mt-2 text-sm font-semibold">Une erreur est survenue</h3>
                <p className="mt-1 text-sm text-gray-500">Si elle persiste, contactez un administrateur</p>
            </div>
        )
    }

    if (rows.length === 0) {
        return (
            <div className="text-center pt-20">
                <ArchiveIcon className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-sm font-semibold">Aucun article</h3>
                <p className="mt-1 text-sm text-gray-500">Recherchez avec d'autres critères.</p>
                <div className="mt-6">
                    <Button type="button" className="gap-2" onClick={resetFilters}>
                        <Cross2Icon className="w-4 h-4"/>
                        {currentThread !== null ? "Flux principal" : "Retirer les filtres"}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <ScrollArea
            ref={parentRef}
            className="h-screen w-full"
        >
            <div
                className="relative w-full mx-auto max-w-[500px]"
                style={{
                    height: `${rowVirtualizer.getTotalSize() + cardHeight + cardBottomMargin}px`,
                }}
            >
                {hasPreviousPage ? (
                    <div className="top-0 w-full absolute">
                        <ArticleCardSkeleton />
                    </div>
                ): null}

                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const isLoaderRow = virtualRow.index > rows.length - 1
                    const article = rows[virtualRow.index]

                    return (
                        <div
                            key={virtualRow.index}
                            className="absolute top-0 left-0 w-full"
                            style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start + topMargin}px)`,
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
    )
}
