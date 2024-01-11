import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/Components/ui/tooltip";
import {Button} from "@/Components/ui/button";
import {BookmarkFilledIcon, BookmarkIcon} from "@radix-ui/react-icons";
import React from "react";
import {Article} from "@/types";

interface ArticleCardBookmarkIndicator {
    article: Article
}

export default function ArticleCardBookmarkIndicator({article}: ArticleCardBookmarkIndicator) {

    const bookmarked = article.threads.length > 0

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost">
                        {bookmarked ? (
                            <BookmarkFilledIcon className="h-5 w-5"/>
                        ): (
                            <BookmarkIcon className="h-5 w-5"/>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {bookmarked ? (
                        <p>Ajouté à {article.threads.map((thread) => `${thread.name} `)}</p>
                    ): (
                        <p>Ajouter à ma veille</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
