import {Label} from "@/Components/ui/label";
import {Switch} from "@/Components/ui/switch";
import {router, usePage} from "@inertiajs/react";
import React, {useEffect, useState} from "react";
import {Config, Tag} from "@/types";
import TagCombobox from "@/Components/form/tag-combobox";
import {useFilterStore} from "@/Stores/filter-store";
import {useShallow} from "zustand/react/shallow";
import {Item} from "@/Components/form/multiple-select";
import {useDebounce} from "@/Hooks/use-debounce";
import {useUpdateEffect} from "@/Hooks/use-updated-effect";

export default function ConfigDefaultTags() {
    const { config: { use_default_tags } } = usePage<{config: Config}>().props

    const [selectedTags, setSelectedTags] = useState<Array<Item>>([])
    const debouncedSelectedTags = useDebounce(selectedTags, 500)

    const {
        tags,
        defaultTags
    } = useFilterStore(useShallow((state) => ({
        tags: state.tags,
        defaultTags: state.defaultTags
    })))

    useUpdateEffect(() => {
        if (debouncedSelectedTags.length === defaultTags.length) {
            return
        }
        router.put(route('config.tags.update'), {
            tags: debouncedSelectedTags.map((tag) => tag.key)
        })
    }, [debouncedSelectedTags])

    useEffect(() => {
        setSelectedTags(defaultTags.map((tag) => ({key: tag.id, value: tag.label})))
    }, [defaultTags])

    const toggle = (checked: boolean) => {
        router.post(route('config.tags.store'), {
            state: checked
        })
    }

    const items = tags.map((tag) => ({key: tag.id, value: tag.label}))

    return (
        <div className="rounded-lg border p-3 shadow-sm">
            <div className="flex flex-row items-center justify-between ">
                <div className="space-y-0.5">
                    <Label htmlFor="default-tags">Tags par défaut</Label>
                    <div className="text-[0.8rem] text-muted-foreground">
                        Des tags sont automatiquement assignés à votre compte pour préfiltrer les articles
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
            <div className="mt-6 relative flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                {!use_default_tags ? (<div className="absolute inset-0 z-10 bg-muted/50"/>): null}
                <TagCombobox data={items} selectedItems={[selectedTags, setSelectedTags]} />
            </div>
        </div>
    )
}
