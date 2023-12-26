import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import { PageProps } from '@/types';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {Input} from "@/Components/ui/input";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Button} from "@/Components/ui/button";
import {Card, CardContent, CardHeader} from "@/Components/ui/card";
import {Textarea} from "@/Components/ui/textarea";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/Components/ui/tabs";
import {marked} from "marked";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Le titre est requis",
    }).max(255, "Le titre est trop long"),
    content: z.string().min(1, {
        message: "Le contenu est requis",
    }).max(500, "Le contenu est trop long"),
})

export default function Dashboard({ auth }: PageProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: ""
        },
    })

    const content = form.watch('content')

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/articles', values, {
            onSuccess: () => {
                form.reset()
            }
        })
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <Card className="mt-20 mx-auto max-w-[500px]">
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
        </AuthenticatedLayout>
    );
}
