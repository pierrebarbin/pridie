import { Button } from "@/Components/ui/button"
import { Reaction } from "@/types"

interface ArticleCardReactionItemProps {
    reaction: { id: string; count: number }
    allReactions: Reaction[]
    userReactions: { id: string }[]
    reactTo: (reaction: Reaction, add: boolean) => void
}

export default function ArticleCardReactionLisItem({
    reaction,
    userReactions,
    allReactions,
    reactTo,
}: ArticleCardReactionItemProps) {
    const reactionItem = allReactions.find((react) => react.id === reaction.id)
    const reacted = userReactions.find(
        (userReaction) => userReaction.id === reaction.id,
    )

    if (!reactionItem || reaction.count <= 0) {
        return null
    }

    if (reacted !== undefined) {
        return (
            <Button
                key={reaction.id}
                variant="secondary"
                size="sm"
                className="flex gap-2"
                onClick={() => reactTo(reactionItem, false)}
            >
                <span>{reactionItem.image}</span>
                <span className="font-semibold">{reaction.count}</span>
            </Button>
        )
    }

    return (
        <Button
            key={reaction.id}
            variant="outline"
            size="sm"
            className="flex gap-2"
            onClick={() => reactTo(reactionItem, true)}
        >
            <span>{reactionItem.image}</span>
            <span className="font-semibold">{reaction.count}</span>
        </Button>
    )
}
