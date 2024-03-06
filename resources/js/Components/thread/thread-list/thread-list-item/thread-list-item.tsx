import { router } from "@inertiajs/react";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import React from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/Components/ui/context-menu";
import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/Stores/filter-store";
import { Thread } from "@/types";

interface ThreadListItemProps {
    thread: Thread;
}

export default function ThreadListItem({ thread }: ThreadListItemProps) {
    const { currentThread, changeCurrentThreadTo } = useFilterStore(
        useShallow((state) => ({
            currentThread: state.currentThread,
            changeCurrentThreadTo: state.changeCurrentThreadTo,
        })),
    );

    const remove = () => {
        router.delete(route("threads.destroy", { thread: thread.id }), {
            onSuccess: () => {
                toast(`Flux ${thread.name} supprimé`);
            },
        });
    };

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
                        {thread.id === currentThread?.id ? (
                            <BookmarkFilledIcon className="ml-2 h-3 w-3" />
                        ) : null}
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
    );
}
