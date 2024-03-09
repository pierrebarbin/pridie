import React from "react"

import ArticleCardPreview from "@/Components/article/article-card/article-card.preview"
import ArticleCardSkeleton from "@/Components/article/article-card/article-card.skeleton"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/Components/ui/resizable"
import { useArticleCreationStore } from "@/Stores/article-creation-store"

export default function DashboardArticlePreview() {
    const article = useArticleCreationStore((state) => state.article)

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="max-w-[540px] overflow-visible"
        >
            <ResizablePanel className="mr-3" minSize={50}>
                <div className="h-[650px] max-w-[500px] space-y-[30px] overflow-hidden">
                    <div className="-mt-80">
                        <ArticleCardSkeleton />
                    </div>
                    <ArticleCardPreview article={article} />
                    <div>
                        <ArticleCardSkeleton />
                    </div>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={3}
                minSize={3}
                className="bg-muted/30"
            />
        </ResizablePanelGroup>
    )
}
