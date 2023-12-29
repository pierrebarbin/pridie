import {Card, CardContent, CardHeader} from "@/Components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {Input} from "@/Components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/Components/ui/tabs";
import {Textarea} from "@/Components/ui/textarea";
import {marked} from "marked";
import {Button} from "@/Components/ui/button";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {router, usePage} from "@inertiajs/react";
import TagCombobox from "@/Components/form/tag-combobox";
import {Tag} from "@/types";
import {toast} from "sonner";
import {Item} from "@/Components/form/multiple-select";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Le titre est requis",
    }).max(255, "Le titre est trop long"),
    content: z.string().min(1, {
        message: "Le contenu est requis",
    }).max(500, "Le contenu est trop long"),
    tags: z.array(z.object({
        key: z.string(),
        value: z.string()
    }))
})
export default function DashboardArticleForm() {
    const selectedItems = useState<Array<Item>>([])

    const {tags} = usePage<{tags: Array<Tag>}>().props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: []
        },
    })

    const content = form.watch('content')

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route('articles.store'), {
            ...values,
            tags: values.tags.map((item) => item.key)
        }, {
            onSuccess: () => {
                form.reset()
                selectedItems[1]([])
                toast(`Article ${values.title} ajouté`)
            }
        })
    }

    const tagsFormatted = tags.map((tag) => ({key: tag.id, value: tag.label}))

    return (
        <Card>
            <CardHeader>
                Ajouter un article
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="titre..." {...field} />
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
                                            onItemSelected={(items) => form.setValue('tags', items)}
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
                                    <Tabs defaultValue="markdown">
                                        <TabsList>
                                            <TabsTrigger value="markdown">Markdown</TabsTrigger>
                                            <TabsTrigger value="preview">Preview</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="markdown">
                                            <Textarea placeholder="Contenu..." {...field} className="min-h-[250px]"/>
                                            <div>{content.length}/500</div>
                                        </TabsContent>
                                        <TabsContent value="preview">
                                            <div
                                                className="prose dark:prose-invert min-h-[250px] border border-input"
                                                dangerouslySetInnerHTML={{__html: marked.parse(content)}}
                                            />
                                        </TabsContent>
                                    </Tabs>
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
