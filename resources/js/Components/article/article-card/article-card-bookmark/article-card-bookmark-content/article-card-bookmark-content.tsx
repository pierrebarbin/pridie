import {DrawerClose, DrawerFooter} from "@/Components/ui/drawer";
import {Button} from "@/Components/ui/button";
import {Loader} from "lucide-react";
import ArticleCardBookmarkForm
    from "@/Components/article/article-card/article-card-bookmark/article-card-bookmark-form/article-card-bookmark-form";
import React, {ChangeEvent, ReactElement, Suspense, useCallback, useState} from "react";
import {Article} from "@/types";
import {useDebounceCallback} from "@/Hooks/use-debounce-callback";
import {Input} from "@/Components/ui/input";
import ArticleCardBookmarkFormSkeleton
    from "@/Components/article/article-card/article-card-bookmark/article-card-bookmark-form/article-card-bookmark-form.skeleton";

interface ArticleCardBookmarkContentProps {
    article: Article
    onSuccess: () => void
    footer: (props: { loading: boolean; cannotSubmit: boolean }) => ReactElement
}

export default function ArticleCardBookmarkContent({article, onSuccess, footer}: ArticleCardBookmarkContentProps) {
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
