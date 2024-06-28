import { useState } from "react"

import { Button } from "@/Components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import { Reaction } from "@/types"
import {Rocket} from "lucide-react";

interface ArticleCardReactionPickerProps {
    allReactions: Reaction[]
    userReactions: { id: string }[]
    reactTo: (reaction: Reaction, add: boolean) => void
}

export default function ArticleCardReactionPicker({
    allReactions,
    userReactions,
    reactTo,
}: ArticleCardReactionPickerProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={open ? "secondary" : "ghost"} size="sm">
                    <Rocket className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-fit gap-2 p-1" side="top">
                {allReactions.map((reaction) => {
                    const reacted = userReactions.find(
                        (userReaction) => userReaction.id === reaction.id,
                    )
                    return (
                        <Button
                            key={reaction.id}
                            variant={
                                reacted !== undefined ? "secondary" : "ghost"
                            }
                            size="sm"
                            onClick={() =>
                                reactTo(reaction, reacted === undefined)
                            }
                        >
                            {reaction.image}
                        </Button>
                    )
                })}
            </PopoverContent>
        </Popover>
    )
}
