import { ReactElement } from "react"

import ConfigDefaultTags from "@/Components/config/config-default-tags/config-default-tags"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"

interface ConfigModalProps {
    children: ReactElement
}

export default function ConfigModal({ children }: ConfigModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="max-w-screen-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Configuration</AlertDialogTitle>
                    <AlertDialogDescription>
                        Configurez votre application
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Tabs
                    defaultValue="tags"
                    orientation="vertical"
                    className="flex gap-4"
                >
                    <TabsList className="flex-col w-32 h-fit">
                        <TabsTrigger value="tags" className="w-full">
                            Tags
                        </TabsTrigger>
                        <TabsTrigger value="other" className="w-full">
                            ...
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tags" className="w-full mt-0 min-h-96">
                        <ConfigDefaultTags />
                    </TabsContent>
                    <TabsContent value="other" className="w-full mt-0 min-h-96">
                        Wip
                    </TabsContent>
                </Tabs>
                <AlertDialogFooter>
                    <AlertDialogAction>Valider</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
