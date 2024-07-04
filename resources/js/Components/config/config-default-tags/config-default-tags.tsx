import { router } from "@inertiajs/react"
import React, { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { Item } from "@/Components/form/multiple-select"
import TagCombobox from "@/Components/form/tag-combobox"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { useDebounceCallback } from "@/Hooks/use-debounce-callback"
import { useTags } from "@/Hooks/use-tags"
import { useAppStoreContext } from "@/Stores/use-app-store"

export default function ConfigDefaultTags() {
    const [tagSearch, setTagSearch] = useState("")
    const [selectedTags, setSelectedTags] = useState<Item[]>([])

    const defaultTags = useAppStoreContext((state) => state.defaultTags)
    const useDefaultTags = useAppStoreContext((state) => state.useDefaultTags)
    const updateUseDefaultTags = useAppStoreContext(
        (state) => state.updateUseDefaultTags,
    )

    const debounceCallback = useCallback(
        (selectedTags: Item[]) => {
            if (selectedTags.length === defaultTags.length) {
                return
            }
            router.put(route("config.tags.update"), {
                tags: selectedTags.map((tag) => tag.key),
            })
        },
        [selectedTags, defaultTags],
    )

    const debounced = useDebounceCallback(debounceCallback, 500)

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTags({
        search: tagSearch,
    })

    const updateTags = (tags: Item[]) => {
        setSelectedTags(tags)
        debounced(tags)
    }

    useEffect(() => {
        updateTags(
            defaultTags.map((tag) => ({ key: tag.id, value: tag.label })),
        )
    }, [defaultTags])

    const toggle = (checked: boolean) => {
        updateUseDefaultTags(checked)
        router.post(
            route("config.tags.store"),
            {
                state: checked,
            },
            {
                onError: () => {
                    updateUseDefaultTags(!checked)
                    toast.error(
                        "La mise à jour de vos tags par défaut na pas fonctionné",
                    )
                },
            },
        )
    }

    const handleEndReached = () => {
        if (!hasNextPage || isFetchingNextPage) {
            return
        }
        fetchNextPage()
    }

    const rows = data ? data.pages.flatMap((d) => d.data) : []

    const items = rows.map((tag) => ({ key: tag.id, value: tag.label }))

    return (
        <div className="rounded-lg border p-3 shadow-sm">
            <div className="flex flex-row items-center justify-between ">
                <div className="space-y-0.5">
                    <Label htmlFor="default-tags">Tags par défaut</Label>
                    <div className="text-[0.8rem] text-muted-foreground">
                        Des tags sont automatiquement assignés à votre compte
                        pour préfiltrer les articles
                    </div>
                </div>
                <div>
                    <Switch
                        id="default-tags"
                        defaultChecked={useDefaultTags}
                        onCheckedChange={toggle}
                    />
                </div>
            </div>
            <div className="relative mt-6 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                {!useDefaultTags ? (
                    <div className="absolute inset-0 z-10 bg-muted/50" />
                ) : null}
                <TagCombobox
                    data={items}
                    selectedItems={[selectedTags, updateTags]}
                    onSearch={setTagSearch}
                    onEndReached={handleEndReached}
                />
            </div>
        </div>
    )
}
