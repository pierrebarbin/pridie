import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/Components/ui/tooltip";
import {Button} from "@/Components/ui/button";
import {BookmarkFilledIcon, BookmarkIcon} from "@radix-ui/react-icons";
import React, {useEffect, useState} from "react";
import {Article} from "@/types";
import {router} from "@inertiajs/react";
import {useDebounce} from "@/Hooks/use-debounce";
import {useUpdateEffect} from "@/Hooks/use-updated-effect";

interface ArticleCardBookmarkProps {
    article: Article
}

export default function ArticleCardBookmark({article}: ArticleCardBookmarkProps) {
    const [bookmarked, setBookmarked] = useState(article.bookmarked)
    const debouncedValue = useDebounce<boolean>(bookmarked, 500)

    useUpdateEffect(() => {
        const post = async () => {


            await fetch(route('api.bookmark.store'), {
                method: "post",
                body: JSON.stringify({article_id: article.id, status: !bookmarked})
            })
        }

        post()
    }, [debouncedValue])

    const bookmark = () => {
        setBookmarked((bookmark) => !bookmark)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={bookmark}>
                        {bookmarked ? (
                            <BookmarkFilledIcon className="h-5 w-5"/>
                        ): (
                            <BookmarkIcon className="h-5 w-5"/>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Ajouter à ma veille</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
