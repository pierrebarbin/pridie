import {Article, Reaction} from "@/types";
import {router, usePage} from "@inertiajs/react";
import {useState} from "react";
import {useUpdateEffect} from "@/Hooks/use-updated-effect";
import {useDebounce} from "@/Hooks/use-debounce";
import ArticleCardReactionPicker from "@/Components/article/article-card-reaction/article-card-reaction-picker";
import ArticleCardReactionList from "@/Components/article/article-card-reaction/article-card-reaction-list";

interface ArticleCardReactionProps {
    article: Article
}

export default function ArticleCardReaction({article}: ArticleCardReactionProps) {

    const [userReactions, setUserReactions] = useState(article.user_reactions)
    const [reactions, setReactions] = useState(article.reactions)

    const { reactions: allReactions } = usePage<{reactions: Array<Reaction>}>().props
    const debouncedUserReactions = useDebounce(userReactions, 1000)

    useUpdateEffect(() => {
        router.post(route('reactions.store', {article: article.id}), {
            reactions: debouncedUserReactions.map((reaction) => reaction.id)
        })
    }, [debouncedUserReactions])

    const reactTo = (reaction: Reaction, add: boolean) => {
        setUserReactions((reactions) => {
            const exists = reactions.find((react) => react.id === reaction.id) !== undefined

            if (exists) {
                return reactions.filter((react) => react.id !== reaction.id)
            }

            return [...reactions, {id: reaction.id}]
        })
        setReactions((reactions) => {
            const react = reactions.find((react) => react.id === reaction.id)

            if (react !== undefined) {
                return reactions.map((react) => {
                    if (react.id === reaction.id) {
                        return {...react, count: add ? react.count + 1 : react.count - 1}
                    }
                    return react
                })
            }

            return [...reactions, {id: reaction.id, count: 1}]
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
