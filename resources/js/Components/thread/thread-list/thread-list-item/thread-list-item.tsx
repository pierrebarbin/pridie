import { router } from "@inertiajs/react"
import { BookmarkCheck } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/Components/ui/context-menu"
import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useAppStoreContext } from "@/Stores/use-app-store"
import { Thread } from "@/types"

interface ThreadListItemProps {
    thread: Thread
}

export default function ThreadListItem({ thread }: ThreadListItemProps) {
    const currentThread = useAppStoreContext((state) => state.currentThread)
    const changeCurrentThreadTo = useAppStoreContext(
        (state) => state.changeCurrentThreadTo,
    )

    const remove = () => {
        router.delete(route("threads.destroy", { thread: thread.id }), {
            onSuccess: () => {
                toast.success(`Flux ${thread.name} supprimé`)
            },
        })
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <NavigationMenuItem className="w-full ">
                    <NavigationMenuLink
                        className={cn(
                            navigationMenuTriggerStyle(),
                            "w-full cursor-pointer justify-end",
                        )}
                        active={thread.id === currentThread?.id}
                        onSelect={() => changeCurrentThreadTo(thread)}
                    >
                        {thread.name}
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel>{thread.name}</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem>Editer</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={remove}>Supprimer</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
