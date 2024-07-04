import { marked } from "marked"
import React, { Suspense } from "react"

import ArticleCardBookmark from "@/Components/article/article-card/article-card-bookmark/article-card-bookmark"
import ArticleCardReaction from "@/Components/article/article-card/article-card-reaction/article-card-reaction"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Article } from "@/types"

interface ArticleCardProps {
    article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const renderer = new marked.Renderer()
    const linkRenderer = renderer.link
    renderer.link = (href, title, text) => {
        const html = linkRenderer.call(renderer, href, title, text)
        return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
    }
    const html = marked(article.content, { renderer })

    return (
        <Card className="relative h-[400px]">
            <CardHeader>
                <CardTitle className="truncate" title={article.title}>
                    {article.title}
                </CardTitle>
                <CardDescription>{article.created_at}</CardDescription>
            </CardHeader>
            <CardContent
                className="prose overflow-hidden dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: html }}
            ></CardContent>
            <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-between rounded-xl bg-card p-4 pt-4 after:absolute after:left-0 after:right-0 after:top-[-20px] after:h-[20px] after:bg-gradient-to-t after:from-gray-50 after:content-[''] dark:after:from-neutral-900">
                <Suspense fallback={<div />}>
                    <ArticleCardReaction article={article} />
                </Suspense>
                <ArticleCardBookmark article={article} />
            </CardFooter>
        </Card>
    )
}
