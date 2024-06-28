import React, {Suspense, useState} from "react"

import ArticleCardBookmarkForm from "@/Components/article/article-card/article-card-bookmark/article-card-bookmark-form/article-card-bookmark-form"
import ArticleCardBookmarkIndicator from "@/Components/article/article-card/article-card-bookmark/article-card-bookmark-indicator/article-card-bookmark-indicator"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer"
import { useIsMobileBreakpoint } from "@/Hooks/use-media-query"
import { Article } from "@/types"
import {Loader} from "lucide-react";

interface ArticleCardBookmarkProps {
    article: Article
}

export default function ArticleCardBookmark({
    article,
}: ArticleCardBookmarkProps) {
    const [open, setOpen] = useState(false)

    const { isMobile } = useIsMobileBreakpoint()

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <div>
                        <ArticleCardBookmarkIndicator article={article} />
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm p-2">
                        <DrawerHeader className="mb-6">
                            <DrawerTitle>{article.title}</DrawerTitle>
                            <DrawerDescription>
                                Ajouter l'article à un ou plusieurs flux de
                                veilles
                            </DrawerDescription>
                        </DrawerHeader>
                        <Suspense>
                            <ArticleCardBookmarkForm
                                article={article}
                                onSuccess={() => setOpen(false)}
                                footer={({ loading, cannotSubmit }) => (
                                    <DrawerFooter>
                                        <Button
                                            type="submit"
                                            disabled={cannotSubmit}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                    Mise à jour
                                                </>
                                            ) : (
                                                "Mettre à jour"
                                            )}
                                        </Button>
                                        <DrawerClose asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                )}
                            />
                        </Suspense>
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div>
                    <ArticleCardBookmarkIndicator article={article} />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{article.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ajouter l'article à un ou plusieurs flux de veilles
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Suspense>
                    <ArticleCardBookmarkForm
                        article={article}
                        onSuccess={() => setOpen(false)}
                        footer={({ loading, cannotSubmit }) => (
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <Button type="submit" disabled={cannotSubmit}>
                                    {loading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            Mise à jour
                                        </>
                                    ) : (
                                        "Mettre à jour"
                                    )}
                                </Button>
                            </AlertDialogFooter>
                        )}
                    />
                </Suspense>
            </AlertDialogContent>
        </AlertDialog>
    )
}
