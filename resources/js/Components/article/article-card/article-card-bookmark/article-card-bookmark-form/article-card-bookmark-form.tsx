import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "@inertiajs/react"
import { useQueryClient } from "@tanstack/react-query"
import React, { ReactElement, useState } from "react"
import { Simulate } from "react-dom/test-utils"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Checkbox } from "@/Components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/Components/ui/form"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useFilterStore } from "@/Stores/filter-store"
import { Article } from "@/types"

import load = Simulate.load

const formSchema = z.object({
    threads: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
        }),
    ),
})

interface ArticleCardBookmarkFormProps {
    article: Article
    onSuccess?: () => void
    footer: (props: { loading: boolean; cannotSubmit: boolean }) => ReactElement
}

export default function ArticleCardBookmarkForm({
    article,
    onSuccess,
    footer,
}: ArticleCardBookmarkFormProps) {
    const [loading, setLoading] = useState(false)

    const threads = useFilterStore((state) => state.threads)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            threads: article.threads,
        },
    })
    const queryClient = useQueryClient()

    const bookmark = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        router.post(
            route("bookmark.store"),
            {
                article_id: article.id,
                threads: values.threads.map((thread) => thread.id),
            },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: ["articles"],
                    })
                    onSuccess && onSuccess()
                },
                onFinish: () => {
                    setLoading(false)
                },
            },
        )
    }

    const itemHeight = 44
    const maxItemsVisible = 7
    const scrollAreaHeight =
        (threads.length < maxItemsVisible ? threads.length : maxItemsVisible) *
        itemHeight
    const cannotSubmit = loading || threads.length === 0

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(bookmark)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="threads"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ScrollArea
                                    style={{ height: scrollAreaHeight }}
                                    type="always"
                                >
                                    {threads.map((thread) => (
                                        <div
                                            className="mb-1 pr-3"
                                            key={thread.id}
                                        >
                                            <label
                                                htmlFor={`thread-${thread.id}`}
                                                className={cn(
                                                    "flex cursor-pointer items-center justify-between space-x-2 p-2",
                                                    field.value?.find(
                                                        (value) =>
                                                            value.id ===
                                                            thread.id,
                                                    ) !== undefined &&
                                                        "rounded bg-primary/10",
                                                )}
                                            >
                                                <span className="font-semibold">
                                                    {thread.name}
                                                </span>

                                                <Checkbox
                                                    id={`thread-${thread.id}`}
                                                    className="h-6 w-6 rounded"
                                                    checked={
                                                        field.value?.find(
                                                            (value) =>
                                                                value.id ===
                                                                thread.id,
                                                        ) !== undefined
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        return checked
                                                            ? field.onChange([
                                                                  ...field.value,
                                                                  thread,
                                                              ])
                                                            : field.onChange(
                                                                  field.value?.filter(
                                                                      (value) =>
                                                                          value.id !==
                                                                          thread.id,
                                                                  ),
                                                              )
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {footer({ loading, cannotSubmit })}
            </form>
        </Form>
    )
}
