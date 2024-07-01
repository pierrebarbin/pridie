import { useState } from "react"

import TagCombobox from "@/Components/form/tag-combobox"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Separator } from "@/Components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group"
import {useAppStoreContext} from "@/Stores/use-app-store";
import {useTags} from "@/Hooks/use-tags";

export default function MenuFilters() {
    const [tagSearch, setTagSearch] = useState("")

    const search =  useAppStoreContext((state) => state.search)
    const showBookmark =  useAppStoreContext((state) => state.showBookmark)
    const selectedTags =  useAppStoreContext((state) => state.selectedTags)
    const updateShowBookmark =  useAppStoreContext((state) => state.updateShowBookmark)
    const updateSearch =  useAppStoreContext((state) => state.updateSearch)
    const updateSelectedTags =  useAppStoreContext((state) => state.updateSelectedTags)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useTags({ search: tagSearch })

    const handleEndReached = () => {
        if (!hasNextPage || isFetchingNextPage) {
            return
        }
        fetchNextPage()
    }

    const rows = data ? data.pages.flatMap((d) => d.data) : []

    const items = rows.map((tag) => ({ key: tag.id, value: tag.label }))

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="search">Titre</Label>
                <Input
                    id="search"
                    className="mt-2"
                    placeholder="Recherchez un titre..."
                    value={search}
                    onChange={(e) => {
                        updateSearch(e.target.value)
                    }}
                />
            </div>
            <Separator />
            <TagCombobox
                data={items}
                selectedItems={[selectedTags, updateSelectedTags]}
                onSearch={setTagSearch}
                onEndReached={handleEndReached}
            />
            <Separator />
            <div>
                <Label>Afficher les articles ajoutés à mes flux</Label>
                <ToggleGroup
                    type="single"
                    className="m-2 w-fit gap-2"
                    defaultValue="yes"
                    value={showBookmark}
                    onValueChange={updateShowBookmark}
                >
                    <ToggleGroupItem
                        variant="outline"
                        value="yes"
                        aria-label="Afficher les articles ajoutés à ma veille"
                    >
                        Oui
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        variant="outline"
                        value="no"
                        aria-label="Cacher les articles ajoutés à ma veille"
                    >
                        Non
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    )
}
