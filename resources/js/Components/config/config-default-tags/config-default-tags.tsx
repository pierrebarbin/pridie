import { router, usePage } from "@inertiajs/react"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"

import { Item } from "@/Components/form/multiple-select"
import TagCombobox from "@/Components/form/tag-combobox"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { useDebounceCallback } from "@/Hooks/use-debounce-callback"
import { Config, CursorPagination, Tag } from "@/types"
import {useFilterStoreContext} from "@/Stores/use-filter-store";

export default function ConfigDefaultTags() {
    const [tagSearch, setTagSearch] = useState("")
    const [selectedTags, setSelectedTags] = useState<Item[]>([])

    const {
        config: { use_default_tags },
    } = usePage<{ config: Config }>().props

    const defaultTags =  useFilterStoreContext((state) => state.defaultTags)

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

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery<CursorPagination<Tag>>({
            queryKey: ["tags", { tagSearch }],
            queryFn: async ({ pageParam }) => {
                const params = {
                    cursor: pageParam as string,
                    "filter[label]": tagSearch,
                }

                const cleanParams = Object.fromEntries(
                    Object.entries(params).filter(([value]) => value !== ""),
                )

                const urlParams = new URLSearchParams(cleanParams)

                const result = await axios.get(
                    `${route("api.tags")}?${urlParams.toString()}`,
                )

                return result.data
            },
            initialPageParam: null,
            getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
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
        router.post(route("config.tags.store"), {
            state: checked,
        })
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
                        defaultChecked={use_default_tags}
                        onCheckedChange={toggle}
                    />
                </div>
            </div>
            <div className="relative mt-6 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                {!use_default_tags ? (
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
