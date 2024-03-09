import { BookmarkIcon, RocketIcon } from "@radix-ui/react-icons"
import { marked } from "marked"
import React from "react"

import { Button } from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Article } from "@/types"

interface ArticleCardPreviewProps {
    article: Partial<Article> | null
}

export default function ArticleCardPreview({
    article,
}: ArticleCardPreviewProps) {
    const renderer = new marked.Renderer()
    const linkRenderer = renderer.link
    renderer.link = (href, title, text) => {
        const html = linkRenderer.call(renderer, href, title, text)
        return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
    }
    const html = marked(article?.content ?? "", { renderer })

    return (
        <Card className="relative h-[400px]">
            <CardHeader>
                <CardTitle className="truncate" title={article?.title}>
                    {article?.title}
                </CardTitle>
                <CardDescription>
                    {article?.created_at ?? "maintenant"}
                </CardDescription>
            </CardHeader>
            <CardContent
                className="prose overflow-hidden dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: html }}
            ></CardContent>
            <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-between rounded-xl bg-card p-4 pt-4 after:absolute after:left-0 after:right-0 after:top-[-20px] after:h-[20px] after:bg-gradient-to-t after:from-gray-50 after:content-[''] dark:after:from-neutral-900">
                <Button variant="ghost" size="sm">
                    <RocketIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                    <BookmarkIcon className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
