import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/Components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {BookmarkFilledIcon, BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, ReloadIcon} from "@radix-ui/react-icons";
import React, {useState} from "react";
import {useFilterStore} from "@/Stores/filter-store";
import {useShallow} from "zustand/react/shallow";
import {Drawer, DrawerContent, DrawerTrigger} from "@/Components/ui/drawer";
import {ScrollArea} from "@/Components/ui/scroll-area";
import {Separator} from "@/Components/ui/separator";
import {Button} from "@/Components/ui/button";
import {motion} from "framer-motion"
import {useWindowSize} from "@/Hooks/use-window-size";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {Input} from "@/Components/ui/input";
import {z} from "zod";
import {router} from "@inertiajs/react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Le nom est requis",
    }).max(255, "Le nom est trop long"),
})

export default function ThreadListMobile() {
    const [tab, setTab] = useState('list')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const {width} = useWindowSize()

    const {
        threads,
        currentThread,
        removeCurrentThread,
        changeCurrentThreadTo
    } = useFilterStore(useShallow((state) => ({
        threads: state.threads,
        currentThread: state.currentThread,
        removeCurrentThread: state.removeCurrentThread,
        changeCurrentThreadTo: state.changeCurrentThreadTo
    })))

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        router.post(route('threads.store'), values, {
            onSuccess: () => {
                setTab('list')
                form.reset()
                toast(`Flux ${values.name} créé`)
            },
            onFinish: () => {
                setLoading(false)
            }
        })
    }

    const x = tab === "list" ? 0 : -width

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <BookmarkIcon className="h-5 w-5" />
            </DrawerTrigger>
            <DrawerContent className="h-[90%] block">
                <motion.div
                    className="flex h-full pt-4"
                    style={{width: width * 2}}
                    animate={{ x }}
                    transition={{
                        damping: 10,
                        stiffness: 100
                    }}
                >
                    <ScrollArea className="w-1/2 h-full pb-6">
                        <NavigationMenu className="max-w-full block">
                            <NavigationMenuList className="flex-col">
                                <NavigationMenuItem className="w-full mb-2">
                                    <NavigationMenuLink
                                        className={cn(navigationMenuTriggerStyle(), "relative py-3 w-full cursor-pointer h-auto gap-2")}
                                        onSelect={() => {
                                            setTab('create')
                                        }}
                                    >
                                        Ajouter un flux <ChevronRightIcon className="absolute w-4 h-4 right-[30px]" />
                                    </NavigationMenuLink>
                                    <Separator />
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                        <NavigationMenu className="max-w-full block">
                                <NavigationMenuList className="flex-col">
                                    <NavigationMenuItem className="w-full">
                                        <Separator />
                                        <NavigationMenuLink
                                            className={cn(navigationMenuTriggerStyle(), "py-3 w-full cursor-pointer h-auto gap-2")}
                                            active={currentThread === null}
                                            onSelect={() => {
                                                removeCurrentThread()
                                                setOpen(false)
                                            }}
                                        >
                                            Veille principale
                                            {currentThread === null? <BookmarkFilledIcon /> : null}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    {threads.map((thread) => (
                                        <NavigationMenuItem key={thread.id} className="w-full">
                                            <Separator />
                                            <NavigationMenuLink
                                                className={cn(navigationMenuTriggerStyle(), "py-3 w-full cursor-pointer h-auto gap-2")}
                                                active={thread.id === currentThread?.id}
                                                onSelect={() => {
                                                    changeCurrentThreadTo(thread)
                                                    setOpen(false)
                                                }}
                                            >
                                                {thread.name}
                                                {thread.id === currentThread?.id ? <BookmarkFilledIcon /> : null}
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                    </ScrollArea >
                    <div className="w-1/2 p-4">
                        <div className="relative text-center h-10">
                            <Button variant="ghost" className="absolute left-0" onClick={() => setTab('list')}>
                                <ChevronLeftIcon className="w-5 h-5"/>
                            </Button>
                            <span className="inline-block align-middle">Ajouter un flux</span>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                            Ajout en cours
                                        </>
                                    ) : "Ajouter"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </motion.div>
            </DrawerContent>
        </Drawer>
    )
}
