import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/Components/ui/card";
import React from "react";
import {Article} from "@/types";
import edjsHTML from "editorjs-html";

interface ArticleCardProps {
    article: Article
}

const edjsParser = edjsHTML();

export default function ArticleCard({article}: ArticleCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.created_at}</CardDescription>
            </CardHeader>
            <CardContent>
                <div dangerouslySetInnerHTML={{__html: edjsParser.parse(JSON.parse((article.content)))}}/>
            </CardContent>
            {/*<CardFooter>*/}
            {/*    <p>Card Footer</p>*/}
            {/*</CardFooter>*/}
        </Card>
    )
}
