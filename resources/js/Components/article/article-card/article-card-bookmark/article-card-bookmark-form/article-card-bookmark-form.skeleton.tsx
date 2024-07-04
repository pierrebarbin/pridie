import React from "react"

import { ScrollArea } from "@/Components/ui/scroll-area"
import { Skeleton } from "@/Components/ui/skeleton"

export default function ArticleCardBookmarkFormSkeleton() {
    return (
        <ScrollArea className="h-80" type="always">
            {[...Array(10).keys()].map((i) => (
                <Skeleton key={i} className="mt-2 h-10 w-full" />
            ))}
        </ScrollArea>
    )
}
