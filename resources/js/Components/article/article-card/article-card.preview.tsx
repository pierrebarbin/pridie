import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/Components/ui/card";
import React from "react";
import {marked} from "marked";
import {Article} from "@/types";
import {Button} from "@/Components/ui/button";
import {BookmarkIcon, RocketIcon} from "@radix-ui/react-icons";

interface ArticleCardPreviewProps {
    article: Partial<Article>|null
}

export default function ArticleCardPreview({article}: ArticleCardPreviewProps) {

    const renderer = new marked.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
        const html = linkRenderer.call(renderer, href, title, text);
        return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };
    const html = marked(article?.content ?? "", { renderer });

    return (
        <Card className="relative h-[400px]">
            <CardHeader>
                <CardTitle className="truncate" title={article?.title}>{article?.title}</CardTitle>
                <CardDescription>{article?.created_at ?? "maintenant"}</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert overflow-hidden" dangerouslySetInnerHTML={{__html: html}}>
            </CardContent>
            <CardFooter className="absolute p-4 pt-4 bg-card flex justify-between bottom-0 left-0 right-0 rounded-xl after:content-[''] after:absolute after:top-[-20px] after:right-0 after:left-0 after:h-[20px] after:bg-gradient-to-t after:from-gray-50 dark:after:from-neutral-900">
                <Button variant="ghost" size="sm">
                    <RocketIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                    <BookmarkIcon className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
