import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "@inertiajs/react"
import { motion } from "framer-motion"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/Components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/Components/ui/drawer"
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
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Separator } from "@/Components/ui/separator"
import { useWindowSize } from "@/Hooks/use-window-size"
import { cn } from "@/lib/utils"
import {useAppStoreContext} from "@/Stores/use-app-store";
import {Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Loader} from "lucide-react";
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

export default function ThreadListDrawer() {
    const [tab, setTab] = useState("list")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const { width } = useWindowSize()

    const currentThread =  useAppStoreContext((state) => state.currentThread)
    const removeCurrentThread =  useAppStoreContext((state) => state.removeCurrentThread)
    const changeCurrentThreadTo =  useAppStoreContext((state) => state.changeCurrentThreadTo)

    const {data} = useSuspenseInfiniteQuery<CursorPagination<Thread>>({
        queryKey: threadsData.infinite.key({ search: "" }),
        queryFn: async ({ pageParam }) => {
            return await threadsData.infinite.handle({ cursor: pageParam as string, search: "" })
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    })

    const queryClient = useQueryClient()

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        router.post(route("threads.store"), values, {
            onSuccess: () => {
                setTab("list")
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

    const x = tab === "list" ? 0 : -width
    const rows = data ? data.pages.flatMap((d) => d.data) : []

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Bookmark className="h-5 w-5" />
            </DrawerTrigger>
            <DrawerContent className="block h-[90%]">
                <motion.div
                    className="flex h-full pt-4"
                    style={{ width: width * 2 }}
                    animate={{ x }}
                    transition={{
                        damping: 10,
                        stiffness: 100,
                    }}
                >
                    <ScrollArea className="h-full w-1/2 pb-6">
                        <NavigationMenu className="block max-w-full">
                            <NavigationMenuList className="flex-col">
                                <NavigationMenuItem className="mb-2 w-full">
                                    <NavigationMenuLink
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "relative h-auto w-full cursor-pointer gap-2 py-3",
                                        )}
                                        onSelect={() => {
                                            setTab("create")
                                        }}
                                    >
                                        Ajouter un flux{" "}
                                        <ChevronRight className="absolute right-[30px] h-4 w-4" />
                                    </NavigationMenuLink>
                                    <Separator />
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                        <NavigationMenu className="block max-w-full">
                            <NavigationMenuList className="flex-col">
                                <NavigationMenuItem className="w-full">
                                    <Separator />
                                    <NavigationMenuLink
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "h-auto w-full cursor-pointer gap-2 py-3",
                                        )}
                                        active={currentThread === null}
                                        onSelect={() => {
                                            removeCurrentThread()
                                            setOpen(false)
                                        }}
                                    >
                                        Veille principale
                                        {currentThread === null ? (
                                            <BookmarkCheck className="w-5 h-5" />
                                        ) : null}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                {rows.map((thread) => (
                                    <NavigationMenuItem
                                        key={thread.id}
                                        className="w-full"
                                    >
                                        <Separator />
                                        <NavigationMenuLink
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "h-auto w-full cursor-pointer gap-2 py-3",
                                            )}
                                            active={
                                                thread.id === currentThread?.id
                                            }
                                            onSelect={() => {
                                                changeCurrentThreadTo(thread)
                                                setOpen(false)
                                            }}
                                        >
                                            {thread.name}
                                            {thread.id === currentThread?.id ? (
                                                <BookmarkCheck className="w-5 h-5" />
                                            ) : null}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </ScrollArea>
                    <div className="w-1/2 p-4">
                        <div className="relative h-10 text-center">
                            <Button
                                variant="ghost"
                                className="absolute left-0"
                                onClick={() => setTab("list")}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <span className="inline-block align-middle">
                                Ajouter un flux
                            </span>
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="mt-6 space-y-4"
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
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            Ajout en cours
                                        </>
                                    ) : (
                                        "Ajouter"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </motion.div>
            </DrawerContent>
        </Drawer>
    )
}
