import { router, usePage } from "@inertiajs/react"
import { useCallback, useState } from "react"

import ArticleCardReactionList from "@/Components/article/article-card/article-card-reaction/article-card-reaction-list"
import ArticleCardReactionPicker from "@/Components/article/article-card/article-card-reaction/article-card-reaction-picker"
import { useDebounceCallback } from "@/Hooks/use-debounce-callback"
import { Article, Reaction } from "@/types"

interface ArticleCardReactionProps {
    article: Article
}

export default function ArticleCardReaction({
    article,
}: ArticleCardReactionProps) {
    const [userReactions, setUserReactions] = useState(article.user_reactions)
    const [reactions, setReactions] = useState(article.reactions)

    const { reactions: allReactions } = usePage<{ reactions: Reaction[] }>()
        .props

    const debounceCallback = useCallback(
        (reactions: { id: string }[]) => {
            router.post(route("reactions.store", { article: article.id }), {
                reactions: reactions.map((reaction) => reaction.id),
            })
        },
        [article],
    )

    const debounced = useDebounceCallback(debounceCallback, 1000)

    const reactTo = (reaction: Reaction, add: boolean) => {
        setUserReactions((reactions) => {
            const exists =
                reactions.find((react) => react.id === reaction.id) !==
                undefined

            if (exists) {
                return reactions.filter((react) => react.id !== reaction.id)
            }

            const newReactions = [...reactions, { id: reaction.id }]

            debounced(newReactions)

            return newReactions
        })
        setReactions((reactions) => {
            const react = reactions.find((react) => react.id === reaction.id)

            if (react !== undefined) {
                return reactions.map((react) => {
                    if (react.id === reaction.id) {
                        return {
                            ...react,
                            count: add ? react.count + 1 : react.count - 1,
                        }
                    }
                    return react
                })
            }

            return [...reactions, { id: reaction.id, count: 1 }]
        })
    }

    return (
        <div className="flex gap-2">
            <ArticleCardReactionPicker
                allReactions={allReactions}
                userReactions={userReactions}
                reactTo={reactTo}
            />
            <ArticleCardReactionList
                reactions={reactions}
                allReactions={allReactions}
                userReactions={userReactions}
                reactTo={reactTo}
            />
        </div>
    )
}
