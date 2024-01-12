import {Card, CardContent, CardFooter, CardHeader} from "@/Components/ui/card";
import React from "react";
import {Skeleton} from "@/Components/ui/skeleton";

export default function ArticleCardSkeleton() {
    return (
        <Card className="h-[400px] relative">
            <CardHeader>
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-1/4 h-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="w-full h-[200px]" />
            </CardContent>
            <CardFooter className="absolute p-4 pt-4 bg-card flex justify-between bottom-0 left-0 right-0 rounded-xl after:content-[''] after:absolute after:top-[-20px] after:right-0 after:left-0 after:h-[20px] after:bg-gradient-to-t after:from-gray-50 dark:after:from-neutral-900">
                <Skeleton className="w-[38px] h-[32px]" />
                <Skeleton className="w-[38px] h-[32px]" />
            </CardFooter>
        </Card>
    )
}
