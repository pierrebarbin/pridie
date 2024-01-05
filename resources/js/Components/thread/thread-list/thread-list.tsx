import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, navigationMenuTriggerStyle
} from "@/Components/ui/navigation-menu";
import {router} from "@inertiajs/react";
import {BookmarkFilledIcon, PlusIcon} from "@radix-ui/react-icons";
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
import {Thread} from "@/types";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Le nom est requis",
    }).max(255, "Le nom est trop long"),
})

interface ThreadListProps {
    threads: Array<Thread>
}

export default function ThreadList({threads}: ThreadListProps) {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route('threads.store'), values)
        setOpen(false)
    }

    return (
        <>
            <NavigationMenu className="mt-10 -mr-6 grow-0">
                <NavigationMenuList className="flex-col gap-2 items-end ">
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            active={route().current('home')}
                            onSelect={() => router.visit(route('home'))}
                        >
                            Veille principale <BookmarkFilledIcon className="ml-2 w-3 h-3" />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {threads.map((thread) => (
                        <NavigationMenuItem key={thread.id}>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                                active={false}
                                onSelect={() => router.visit(route('home'))}
                            >
                                {thread.name}  <BookmarkFilledIcon className="ml-2 w-3 h-3" />
                            </NavigationMenuLink>
                        </NavigationMenuItem>
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
                                            <Input placeholder="nom..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <Button type="submit">
                                    Ajouter
                                </Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
