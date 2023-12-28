import {Card, CardContent, CardHeader} from "@/Components/ui/card";
import React from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {router, usePage} from "@inertiajs/react";
import {Tag} from "@/types";
import {Input} from "@/Components/ui/input";
import {Button} from "@/Components/ui/button";
import {Badge} from "@/Components/ui/badge";
import {Cross2Icon} from "@radix-ui/react-icons";
import {toast} from "sonner";

const formSchema = z.object({
    label: z.string().min(1, {
        message: "Le titre est requis",
    }).max(255, "Le titre est trop long")
})

export default function DashboardTagForm() {

    const {tags} = usePage<{tags: Array<Tag>}>().props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: ""
        },
    })

    function create(values: z.infer<typeof formSchema>) {
        router.post(route('tags.store'), values, {
            onSuccess: () => {
                form.reset()
                toast(`Article ${values.label} ajouté`)
            }
        })
    }

    function remove(tag: Tag) {
        router.post(route('tags.destroy', {tag: tag.id}), undefined, {
            onSuccess: () => {
                toast(`Tag ${tag.label} supprimé`)
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                Tags
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(create)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="label..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Ajouter</Button>
                    </form>
                </Form>
                <div className="mt-4 flex gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="flex items-center gap-2 pr-0.5">
                            {tag.label}
                            <Button className="h-auto p-1" variant="ghost" onClick={() => remove(tag)}>
                                <Cross2Icon className="w-4 h-4" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
