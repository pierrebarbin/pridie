import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/Components/ui/card";
import React from "react";
import {Article} from "@/types";
import {marked} from "marked";

interface ArticleCardProps {
    article: Article
}



export default function ArticleCard({article}: ArticleCardProps) {

    const renderer = new marked.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
        const html = linkRenderer.call(renderer, href, title, text);
        return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };
    const html = marked(article.content, { renderer });

    return (
        <Card className="relative h-[400px] overflow-hidden">
            <CardHeader>
                <CardTitle className="truncate" title={article.title}>{article.title}</CardTitle>
                <CardDescription>{article.created_at}</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert" dangerouslySetInnerHTML={{__html: html}}>
            </CardContent>
            <CardFooter className="absolute p-4 pt-4 bg-card flex justify-end bottom-0 left-0 right-0 after:content-[''] after:absolute after:top-[-20px] after:right-0 after:left-0 after:h-[20px] after:bg-gradient-to-t after:from-neutral-900">
            </CardFooter>
        </Card>
    )
}
