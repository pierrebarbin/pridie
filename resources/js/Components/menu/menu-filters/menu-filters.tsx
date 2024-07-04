import { useState } from "react"

import TagCombobox from "@/Components/form/tag-combobox"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Separator } from "@/Components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group"
import { useTags } from "@/Hooks/use-tags"
import { useAppStoreContext } from "@/Stores/use-app-store"
import MenuFiltersAdvanced from "@/Components/menu/menu-filters/menu-filters-advanced/menu-filters-advanced";
import {Button} from "@/Components/ui/button";
import {X} from "lucide-react";

export default function MenuFilters() {
    const alwaysDisplayAdvancedFilters = useAppStoreContext((state) => state.alwaysDisplayAdvancedFilters)

    const [openAdvanced, setOpenAdvanced] = useState(alwaysDisplayAdvancedFilters)
    const [tagSearch, setTagSearch] = useState("")

    const search = useAppStoreContext((state) => state.search)
    const selectedTags = useAppStoreContext((state) => state.selectedTags)
    const updateSearch = useAppStoreContext((state) => state.updateSearch)
    const updateSelectedTags = useAppStoreContext(
        (state) => state.updateSelectedTags,
    )

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useTags({
        search: tagSearch,
    })

    const toggleAdvancedFilters = () => {
        setOpenAdvanced((old) => !old)
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

            {openAdvanced ? (
                <>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <div className="font-semibold">Filtres avancés</div>
                        <Button variant="ghost" size="icon" onClick={toggleAdvancedFilters}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <MenuFiltersAdvanced />
                </>) : (
                <Button variant="secondary" onClick={toggleAdvancedFilters}>
                    Afficher les filtres avancés
                </Button>
            )}
        </div>
    )
}
