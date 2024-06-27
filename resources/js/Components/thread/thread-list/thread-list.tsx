import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "@inertiajs/react"
import { BookmarkFilledIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import ThreadListItem from "@/Components/thread/thread-list/thread-list-item/thread-list-item"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
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
import {useFilterStoreContext} from "@/Stores/use-filter-store";

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

    const threads =  useFilterStoreContext((state) => state.threads)
    const currentThread =  useFilterStoreContext((state) => state.currentThread)
    const removeCurrentThread =  useFilterStoreContext((state) => state.removeCurrentThread)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        router.post(route("threads.store"), values, {
            onSuccess: () => {
                setOpen(false)
                form.reset()
                toast(`Flux ${values.name} créé`)
            },
            onFinish: () => {
                setLoading(false)
            },
        })
    }

    return (
        <>
            <NavigationMenu className="-mr-6 mt-10 grow-0">
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
                            {currentThread === null ? (
                                <BookmarkFilledIcon className="ml-2 h-3 w-3" />
                            ) : null}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {threads.map((thread) => (
                        <ThreadListItem thread={thread} key={thread.id} />
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="-mr-6 mt-2 flex">
                        Ajouter un flux <PlusIcon className="ml-2 h-3 w-3" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ajouter un flux</AlertDialogTitle>
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
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
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
