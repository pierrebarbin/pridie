import {Card, CardContent, CardFooter, CardHeader} from "@/Components/ui/card";
import React from "react";
import {Skeleton} from "@/Components/ui/skeleton";

export default function ArticleCardSkeleton() {
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-1/4 h-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="w-full h-[200px]" />
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}
