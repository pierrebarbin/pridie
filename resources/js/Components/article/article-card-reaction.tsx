import {Article} from "@/types";

interface ArticleCardReactionProps {
    article: Article
}

export default function ArticleCardReaction({article}: ArticleCardReactionProps) {
    console.log(article.reactions)
    return (
        <div>
            {/*{article.reactions.map((reaction) => (*/}
            {/*    <div>{reaction.id}: {reaction.count}</div>*/}
            {/*))}*/}
        </div>
    )
}
