import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import { PageProps } from '@/types';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {Input} from "@/Components/ui/input";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Button} from "@/Components/ui/button";
import EditorJS from '@editorjs/editorjs';
import {useEffect, useRef} from "react";
// @ts-ignore
import LinkTool from '@editorjs/link';
// @ts-ignore
import CodeTool from '@editorjs/code';

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Le titre est requis",
    }).max(255, "Le titre est trop long"),
    content: z.string().min(1, {
        message: "Le contenu est requis",
    }).max(8000, "Le contenu est trop long"),
})

export default function Dashboard({ auth }: PageProps) {

    const ejInstance = useRef<EditorJS|null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: undefined
        },
    })

    useEffect(() => {
        if (ejInstance.current === null) {
            initEditor();
        }

        return () => {
            ejInstance?.current?.destroy();
            ejInstance.current = null;
        };
    }, []);

    const initEditor = () => {
        const editor = new EditorJS({
            holder: 'editorjs',
            onReady: () => {
                ejInstance.current = editor;
            },
            autofocus: true,
            data: undefined,
            onChange: async () => {
                form.setValue('content', JSON.stringify(await editor.saver.save()));
            },
            tools: {
                linkTool: {
                    class: LinkTool,
                    config: {
                        endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
                    }
                },
                code: CodeTool,
            }
        });
    };

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post('/articles', values, {
            onSuccess: () => {
                form.reset()
                ejInstance.current?.blocks.clear()
            }
        })
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-20 space-y-8 mx-auto max-w-[500px]">
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
                                <div id="editorjs" className="p-2 bg-foreground rounded text-secondary"/>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>

        </AuthenticatedLayout>
    );
}
