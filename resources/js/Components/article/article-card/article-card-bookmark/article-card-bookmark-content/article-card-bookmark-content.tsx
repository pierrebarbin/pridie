import { Loader } from "lucide-react"
import React, {
    ChangeEvent,
    ReactElement,
    Suspense,
    useCallback,
    useState,
} from "react"

import ArticleCardBookmarkForm from "@/Components/article/article-card/article-card-bookmark/article-card-bookmark-form/article-card-bookmark-form"
import ArticleCardBookmarkFormSkeleton from "@/Components/article/article-card/article-card-bookmark/article-card-bookmark-form/article-card-bookmark-form.skeleton"
import { Button } from "@/Components/ui/button"
import { DrawerClose, DrawerFooter } from "@/Components/ui/drawer"
import { Input } from "@/Components/ui/input"
import { useDebounceCallback } from "@/Hooks/use-debounce-callback"
import { Article } from "@/types"

interface ArticleCardBookmarkContentProps {
    article: Article
    onSuccess: () => void
    footer: (props: { loading: boolean; cannotSubmit: boolean }) => ReactElement
}

export default function ArticleCardBookmarkContent({
    article,
    onSuccess,
    footer,
}: ArticleCardBookmarkContentProps) {
    const [value, setValue] = useState("")
    const [search, setSearch] = useState("")

    const debounceCallback = useCallback((value: string) => {
        setSearch(value)
    }, [])

    const debounced = useDebounceCallback(debounceCallback)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        debounced(e.target.value)
    }

    return (
        <>
            <Input value={value} onChange={handleChange} />
            <Suspense fallback={<ArticleCardBookmarkFormSkeleton />}>
                <ArticleCardBookmarkForm
                    article={article}
                    search={search}
                    onSuccess={onSuccess}
                    footer={footer}
                />
            </Suspense>
        </>
    )
}
