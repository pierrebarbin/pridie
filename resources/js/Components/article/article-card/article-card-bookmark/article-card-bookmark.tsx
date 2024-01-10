import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/Components/ui/tooltip";
import {Button} from "@/Components/ui/button";
import {BookmarkFilledIcon, BookmarkIcon} from "@radix-ui/react-icons";
import React, {useState} from "react";
import {Article} from "@/types";
import {useIsMobileBreakpoint} from "@/Hooks/use-media-query";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/Components/ui/alert-dialog";
import {ScrollArea} from "@/Components/ui/scroll-area";
import {useFilterStore} from "@/Stores/filter-store";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/Components/ui/form";
import {Checkbox} from "@/Components/ui/checkbox";
import {cn} from "@/lib/utils";
import {router} from "@inertiajs/react";
import {queryClient} from "@/app";

interface ArticleCardBookmarkProps {
    article: Article
}

const formSchema = z.object({
    threads: z.array(z.object({
        id: z.string(),
        name: z.string()
    })),
})

export default function ArticleCardBookmark({article}: ArticleCardBookmarkProps) {
    const [open, setOpen] = useState(false)
    const [bookmarked, setBookmarked] = useState(article.threads.length > 0)

    const { isMobile } = useIsMobileBreakpoint()

    const threads = useFilterStore((state) => state.threads)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            threads: article.threads
        },
    })

    const bookmark = async (values: z.infer<typeof formSchema>) => {
        router.post(route('bookmark.store'), {
            article_id: article.id,
            threads: values.threads.map((thread) => thread.id),
        }, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({queryKey: ['articles']})
                setBookmarked(values.threads.length > 0)
                setOpen(false)
            }
        })
    }

    if (isMobile) {
        return <></>
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    {bookmarked ? (
                                        <BookmarkFilledIcon className="h-5 w-5"/>
                                    ): (
                                        <BookmarkIcon className="h-5 w-5"/>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {bookmarked ? (
                                    <p>Ajouté à {article.threads.map((thread) => thread.name)}</p>
                                ): (
                                    <p>Ajouter à ma veille</p>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{article.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ajouter l'article à un ou plusieurs flux de veilles
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(bookmark)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="threads"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ScrollArea className="max-h-[500px]">
                                           {threads.map((thread) => (
                                               <div className="mb-1" key={thread.id}>
                                                   <label
                                                       htmlFor={`thread-${thread.id}`}
                                                       className={cn(
                                                           "p-2 flex items-center justify-between space-x-2 cursor-pointer",
                                                           field.value?.find((value) => value.id === thread.id) !== undefined && "bg-primary/10 rounded"
                                                       )}
                                                   >
                                                       <span className="font-semibold">{thread.name}</span>

                                                       <Checkbox
                                                           id={`thread-${thread.id}`}
                                                           className="rounded w-6 h-6"
                                                           checked={field.value?.find((value) => value.id === thread.id) !== undefined}
                                                           onCheckedChange={(checked) => {
                                                               return checked
                                                                   ? field.onChange([...field.value, thread])
                                                                   : field.onChange(
                                                                       field.value?.filter(
                                                                           (value) => value.id !== thread.id
                                                                       )
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
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <Button type="submit">Mettre à jour</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
