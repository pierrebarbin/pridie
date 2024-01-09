import ArticleCardReactionLisItem from "@/Components/article/article-card/article-card-reaction/article-card-reaction-lis-item";
import {Popover, PopoverContent, PopoverTrigger} from "@/Components/ui/popover";
import {Button} from "@/Components/ui/button";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {useMediaQuery} from "@/Hooks/use-media-query";
import {Reaction} from "@/types";
import {useState} from "react";

interface ArticleCardReactionListProps {
    reactions: Array<{ id: string, count: number }>
    allReactions: Array<Reaction>
    userReactions: Array<{ id: string }>
    reactTo: (reaction: Reaction, add: boolean) => void
}

export default function ArticleCardReactionList({
    reactions,
    allReactions,
    userReactions,
    reactTo
}: ArticleCardReactionListProps) {

    const [open, setOpen] = useState(false)

    const matches = useMediaQuery('(min-width: 430px)')

    if (reactions.length === 0) {
        return null
    }

    if (matches) {
        return reactions.map((reaction) => (
            <ArticleCardReactionLisItem
                key={reaction.id}
                reaction={reaction}
                allReactions={allReactions}
                userReactions={userReactions}
                reactTo={reactTo}
            />
        ))
    }

    return (
        <>
            <ArticleCardReactionLisItem
                reaction={reactions[0]}
                allReactions={allReactions}
                userReactions={userReactions}
                reactTo={reactTo}
            />
            {reactions.length > 1 ? (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant={open ? "secondary" : "ghost"} size="sm">
                            <DotsHorizontalIcon className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2 w-fit p-1" side="top">
                        {[...reactions].slice(1).map((reaction) => (
                            <ArticleCardReactionLisItem
                                key={reaction.id}
                                reaction={reaction}
                                allReactions={allReactions}
                                userReactions={userReactions}
                                reactTo={reactTo}
                            />
                        ))}
                    </PopoverContent>
                </Popover>
            ): null}
        </>
    )
}
