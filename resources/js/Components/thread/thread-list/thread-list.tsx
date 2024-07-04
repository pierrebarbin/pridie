import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "@inertiajs/react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import ThreadListItem from "@/Components/thread/thread-list/thread-list-item/thread-list-item"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import {useAppStoreContext} from "@/Stores/use-app-store";
import {Loader, Plus} from "lucide-react";
import {useQueryClient, useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {CursorPagination, Pagination, Thread} from "@/types";
import {threadsData} from "@/Data/threads";

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Le nom est requis",
        })
        .max(255, "Le nom est trop long"),
})

export default function ThreadList() {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const currentThread =  useAppStoreContext((state) => state.currentThread)
    const removeCurrentThread =  useAppStoreContext((state) => state.removeCurrentThread)

    const {data} = useSuspenseInfiniteQuery<CursorPagination<Thread>>({
        queryKey: threadsData.infinite.key({ search: "" }),
        queryFn: async ({ pageParam }) => {
            return await threadsData.infinite.handle({ cursor: pageParam as string, search: "" })
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const queryClient = useQueryClient()

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        router.post(route("threads.store"), values, {
            onSuccess: () => {
                setOpen(false)
                form.reset()
                toast.success(`Flux ${values.name} créé`)
                queryClient.invalidateQueries({
                    queryKey: ['threads'],
                })
            },
            onFinish: () => {
                setLoading(false)
            },
        })
    }

    const rows = data ? data.pages.flatMap((d) => d.data).slice(0, 15) : []

    return (
        <>
            <NavigationMenu className="mt-8 grow-0">
                <NavigationMenuList className="flex-col items-end gap-2 ">
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                "cursor-pointer",
                            )}
                            active={currentThread === null}
                            onSelect={() => removeCurrentThread()}
                        >
                            Veille principale
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {rows.map((thread) => (
                        <ThreadListItem thread={thread} key={thread.id} />
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="mt-2 flex">
                        Ajouter un flux <Plus className="ml-2 h-3 w-3" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Nouveau flux</AlertDialogTitle>
                        <AlertDialogDescription>Ajouter un  nouveau flux</AlertDialogDescription>
                    </AlertDialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nom..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            Ajout en cours
                                        </>
                                    ) : (
                                        "Ajouter"
                                    )}
                                </Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
