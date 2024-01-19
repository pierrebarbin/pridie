import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/Components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {BookmarkFilledIcon, BookmarkIcon} from "@radix-ui/react-icons";
import React, {useState} from "react";
import {useFilterStore} from "@/Stores/filter-store";
import {useShallow} from "zustand/react/shallow";
import {Drawer, DrawerContent, DrawerTrigger} from "@/Components/ui/drawer";
import {ScrollArea} from "@/Components/ui/scroll-area";
import {Separator} from "@/Components/ui/separator";
import {Tabs, TabsContent} from "@/Components/ui/tabs";
import {Button} from "@/Components/ui/button";
import {motion, useMotionValue} from "framer-motion"
import {useUpdateEffect} from "@/Hooks/use-updated-effect";

export default function ThreadListMobile() {
    const [tab, setTab] = useState('list')
    const [open, setOpen] = useState(false)

    const [listMotion, setListMotion] = useState<string|number>(0)
    const [createMotion, setCreateMotion] = useState<string|number>("100%")

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

    useUpdateEffect(() => {
        if (tab === "list") {
            setListMotion(0)
            setCreateMotion("100%")
        }

        if (tab === "create") {
            setListMotion("-100%")
            setCreateMotion(0)
        }
    }, [tab])

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <BookmarkIcon className="h-5 w-5" />
            </DrawerTrigger>
            <DrawerContent className="h-[90%]">
                <Tabs value={tab} onValueChange={setTab}>
                    <TabsContent value="list" forceMount asChild>
                        <motion.div
                            animate={{ x: listMotion}}
                            transition={{ damping: 10,
                                stiffness: 100 }}
                        >
                            <ScrollArea className="mt-6 ">
                                <NavigationMenu className="max-w-full block">
                                    <NavigationMenuList className="flex-col">
                                        <NavigationMenuItem className="w-full">
                                            <NavigationMenuLink
                                                className={cn(navigationMenuTriggerStyle(), "py-3 w-full cursor-pointer h-auto gap-2")}
                                                onSelect={() => {
                                                    setTab('create')
                                                }}
                                            >
                                                Ajouter un flux
                                            </NavigationMenuLink>
                                            <Separator />
                                        </NavigationMenuItem>
                                        <NavigationMenuItem className="w-full">
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
                                            <Separator />
                                        </NavigationMenuItem>
                                        {threads.map((thread) => (
                                            <NavigationMenuItem key={thread.id} className="w-full">
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
                                                <Separator />
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </ScrollArea>
                        </motion.div>
                    </TabsContent>
                    <TabsContent value="create" forceMount asChild>
                        <motion.div
                            animate={{x: createMotion}}
                            transition={{ damping: 10,
                                stiffness: 100 }}
                        >
                            <Button onClick={() => setTab('list')}>
                                Back
                            </Button>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </DrawerContent>
        </Drawer>
    )
}
