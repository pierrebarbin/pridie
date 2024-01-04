import {Popover, PopoverContent, PopoverTrigger} from "@/Components/ui/popover";
import {Button} from "@/Components/ui/button";
import {RocketIcon} from "@radix-ui/react-icons";
import {Reaction} from "@/types";
import {useState} from "react";

interface ArticleCardReactionPickerProps {
    allReactions: Array<Reaction>
    userReactions: Array<{id: string}>
    reactTo: (reaction: Reaction, add: boolean) => void
}

export default function ArticleCardReactionPicker({allReactions, userReactions, reactTo}: ArticleCardReactionPickerProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={open ? "secondary" : "ghost"} size="sm">
                    <RocketIcon className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex gap-2 w-fit p-1" side="top">
                {allReactions.map((reaction) => {
                    const reacted = userReactions.find((userReaction) => userReaction.id === reaction.id)
                    return (
                        <Button
                            key={reaction.id}
                            variant={reacted !== undefined ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => reactTo(reaction, reacted === undefined)}
                        >
                            {reaction.image}
                        </Button>
                    )
                })}
            </PopoverContent>
        </Popover>
    )
}
