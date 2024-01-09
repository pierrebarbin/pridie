import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/Components/ui/tooltip";
import {Button} from "@/Components/ui/button";
import {BookmarkFilledIcon, BookmarkIcon} from "@radix-ui/react-icons";
import React, {useState} from "react";
import {Article} from "@/types";
import {usePage} from "@inertiajs/react";
import {useDebounce} from "@/Hooks/use-debounce";
import {useUpdateEffect} from "@/Hooks/use-updated-effect";
import axios from "axios";

interface ArticleCardBookmarkProps {
    article: Article
}

export default function ArticleCardBookmark({article}: ArticleCardBookmarkProps) {
    const [bookmarked, setBookmarked] = useState(article.bookmarked ?? false)
    const debouncedValue = useDebounce<boolean>(bookmarked, 500)

    const {csrf_token} = usePage().props

    useUpdateEffect(() => {
        const post = async () => {
            await axios.post(route('api.bookmark.store'), {
                article_id: article.id,
                state: debouncedValue,
                _token: csrf_token
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
                    {bookmarked ? (
                        <p>Retirer de ma veille</p>
                    ): (
                        <p>Ajouter à ma veille</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
