import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Tag } from "@/types";

const formSchema = z.object({
    label: z
        .string()
        .min(1, {
            message: "Le titre est requis",
        })
        .max(255, "Le titre est trop long"),
});

export default function DashboardTagForm() {
    const { tags } = usePage<{ tags: Tag[] }>().props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
        },
    });

    function create(values: z.infer<typeof formSchema>) {
        router.post(route("tags.store"), values, {
            onSuccess: () => {
                form.reset();
                toast(`Article ${values.label} ajouté`);
            },
        });
    }

    function remove(tag: Tag) {
        router.post(route("tags.destroy", { tag: tag.id }), undefined, {
            onSuccess: () => {
                toast(`Tag ${tag.label} supprimé`);
            },
        });
    }

    return (
        <Card>
            <CardHeader>Tags</CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(create)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="label..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Ajouter</Button>
                    </form>
                </Form>
                <div className="mt-4 inline-flex flex-wrap items-center gap-2 p-1.5">
                    {tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="outline"
                            className="flex items-center gap-2 pr-0.5"
                        >
                            {tag.label}
                            <Button
                                className="h-auto p-1"
                                variant="ghost"
                                onClick={() => remove(tag)}
                            >
                                <Cross2Icon className="h-4 w-4" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
