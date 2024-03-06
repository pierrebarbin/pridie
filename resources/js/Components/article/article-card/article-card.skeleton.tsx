import React from "react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";

export default function ArticleCardSkeleton() {
    return (
        <Card className="relative h-[400px]">
            <CardHeader>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
            <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-between rounded-xl bg-card p-4 pt-4 after:absolute after:left-0 after:right-0 after:top-[-20px] after:h-[20px] after:bg-gradient-to-t after:from-gray-50 after:content-[''] dark:after:from-neutral-900">
                <Skeleton className="h-[32px] w-[38px]" />
                <Skeleton className="h-[32px] w-[38px]" />
            </CardFooter>
        </Card>
    );
}
