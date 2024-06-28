import { zodResolver } from "@hookform/resolvers/zod"
import { router, usePage } from "@inertiajs/react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Item } from "@/Components/form/multiple-select"
import TagCombobox from "@/Components/form/tag-combobox"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { useArticleCreationStore } from "@/Stores/article-creation-store"
import { Tag } from "@/types"

const formSchema = z.object({
    title: z
        .string()
        .min(1, {
            message: "Le titre est requis",
        })
        .max(255, "Le titre est trop long"),
    content: z
        .string()
        .min(1, {
            message: "Le contenu est requis",
        })
        .max(500, "Le contenu est trop long"),
    tags: z.array(
        z.object({
            key: z.string(),
            value: z.string(),
        }),
    ),
})
export default function DashboardArticleForm() {
    const selectedItems = useState<Item[]>([])

    const { tags } = usePage<{ tags: Tag[] }>().props

    const updateArticle = useArticleCreationStore(
        (state) => state.updateArticle,
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
        },
    })

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "title" || name === "content") {
                updateArticle({ [name]: value[name] })
            }
        })
        return () => subscription.unsubscribe()
    }, [form.watch])

    const content = form.watch("content")

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(
            route("articles.store"),
            {
                ...values,
                tags: values.tags.map((item) => item.key),
            },
            {
                onSuccess: () => {
                    form.reset()
                    updateArticle(null)
                    selectedItems[1]([])
                    toast.success(`Article ${values.title} ajouté`)
                },
            },
        )
    }

    const tagsFormatted = tags.map((tag) => ({
        key: tag.id,
        value: tag.label,
    }))

    return (
        <Card>
            <CardHeader>Ajouter un article</CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="titre..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <TagCombobox
                                            data={tagsFormatted}
                                            onSelectedItems={(items) =>
                                                form.setValue("tags", items)
                                            }
                                            selectedItems={selectedItems}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contenu</FormLabel>
                                    <Textarea
                                        placeholder="Contenu..."
                                        {...field}
                                        className="min-h-[250px]"
                                    />
                                    <div>{content.length}/500</div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit">Ajouter</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
