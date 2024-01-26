import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/Components/ui/navigation-menu";
import {router} from "@inertiajs/react";
import {BookmarkFilledIcon, PlusIcon, ReloadIcon} from "@radix-ui/react-icons";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/Components/ui/alert-dialog";
import {Button} from "@/Components/ui/button";
import {Input} from "@/Components/ui/input";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {useShallow} from "zustand/react/shallow";
import {useFilterStore} from "@/Stores/filter-store";
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import ThreadListItem from "@/Components/thread/thread-list/thread-list-item/thread-list-item";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Le nom est requis",
    }).max(255, "Le nom est trop long"),
})

export default function ThreadList() {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })
    const {
        threads,
        currentThread,
        removeCurrentThread,
    } = useFilterStore(useShallow((state) => ({
        threads: state.threads,
        currentThread: state.currentThread,
        removeCurrentThread: state.removeCurrentThread,
    })))

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        router.post(route('threads.store'), values, {
            onSuccess: () => {
                setOpen(false)
                form.reset()
                toast(`Flux ${values.name} créé`)
            },
            onFinish: () => {
                setLoading(false)
            }
        })
    }

    return (
        <>
            <NavigationMenu className="mt-10 -mr-6 grow-0">
                <NavigationMenuList className="flex-col gap-2 items-end ">
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                            active={currentThread === null}
                            onSelect={() => removeCurrentThread()}
                        >
                            Veille principale
                            {currentThread === null? <BookmarkFilledIcon className="ml-2 w-3 h-3" />: null}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {threads.map((thread) => (
                        <ThreadListItem thread={thread} key={thread.id} />
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="mt-2 -mr-6 flex">
                        Ajouter un flux  <PlusIcon className="ml-2 w-3 h-3" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ajouter un flux</AlertDialogTitle>
                    </AlertDialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom..." {...field} />
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
                                    ) : "Ajouter"}
                                </Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
