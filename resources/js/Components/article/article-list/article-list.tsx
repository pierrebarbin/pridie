import React from "react"

import ArticleCard from "@/Components/article/article-card/article-card"
import ArticleCardSkeleton from "@/Components/article/article-card/article-card.skeleton"
import { useArticleList } from "@/Components/article/article-list/use-article-list"
import { Button } from "@/Components/ui/button"
import { ScrollArea } from "@/Components/ui/scroll-area"
import {useAppStoreContext} from "@/Stores/use-app-store";
import {ArrowLeftToLine, FileX, ServerCrash, X} from "lucide-react";

export default function ArticleList() {
    const parentRef = React.useRef<HTMLDivElement>(null)

    const currentThread =  useAppStoreContext((state) => state.currentThread)
    const resetFilters =  useAppStoreContext((state) => state.resetFilters)
    const removeCurrentThread =  useAppStoreContext((state) => state.removeCurrentThread)

    const cardHeight = 400
    const cardBottomMargin = 30

    const {
        data,
        error,
        status,
        hasPreviousPage,
        hasNextPage,
        rowVirtualizer,
        containerHeight,
        topMargin
    } = useArticleList({
        parentRef,
        cardHeight,
        cardBottomMargin,
    })

    const rows = data ? data.pages.flatMap((d) => d.data) : []

    if (status === "pending") {
        return (
            <ScrollArea className="mx-auto h-screen max-w-[500px]">
                {[...Array(10).keys()].map((i) => (
                    <div style={{ marginTop: cardBottomMargin }} key={i}>
                        <ArticleCardSkeleton />
                    </div>
                ))}
            </ScrollArea>
        )
    }

    if (error) {
        return (
            <div className="pt-20 text-center">
                <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
                <h3 className="mt-2 text-sm font-semibold">
                    Une erreur est survenue
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Si elle persiste, contactez un administrateur
                </p>
            </div>
        )
    }

    if (rows.length === 0) {
        return (
            <div className="pt-20 text-center">
                <FileX className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-sm font-semibold">Aucun article</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Recherchez avec d'autres critères.
                </p>
                <div className="mt-6">
                    {currentThread !== null ? (
                        <Button
                            type="button"
                            className="gap-2"
                            onClick={removeCurrentThread}
                        >
                            <ArrowLeftToLine className="h-4 w-4" />
                            Flux principal
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="gap-2"
                            onClick={resetFilters}
                        >
                            <X className="h-4 w-4" />
                            Retirer les filtres
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <ScrollArea ref={parentRef} type="always" className="h-screen w-full">
            <div
                className="relative mx-auto w-full max-w-[500px]"
                style={{
                    height: containerHeight + 'px',
                }}
            >
                {hasPreviousPage ? (
                    <div className="absolute top-0 w-full">
                        <ArticleCardSkeleton />
                    </div>
                ) : null}

                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const isLoaderRow = virtualRow.index > rows.length - 1
                    const article = rows[virtualRow.index]

                    return (
                        <div
                            key={virtualRow.index}
                            className="absolute left-0 top-0 w-full"
                            style={{
                                height: virtualRow.size + 'px',
                                transform: `translateY(${virtualRow.start + topMargin}px)`,
                            }}
                        >
                            {isLoaderRow && hasNextPage ? (
                                <ArticleCardSkeleton key={virtualRow.index} />
                            ) : (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
