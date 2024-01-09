import {Label} from "@/Components/ui/label";
import {Input} from "@/Components/ui/input";
import {Separator} from "@/Components/ui/separator";
import TagCombobox from "@/Components/form/tag-combobox";
import {ToggleGroup, ToggleGroupItem} from "@/Components/ui/toggle-group";
import React from "react";
import {useFilterStore} from "@/Stores/filter-store";
import {useShallow} from "zustand/react/shallow";

export default function MenuFilters() {

    const {
        search,
        tags,
        updateSearch,
        updateSelectedTags,
        showBookmark,
        selectedTags,
        updateShowBookmark
    } = useFilterStore(useShallow((state) => ({
        search: state.search,
        tags: state.tags,
        updateSearch: state.updateSearch,
        updateSelectedTags: state.updateSelectedTags,
        updateShowBookmark: state.updateShowBookmark,
        showBookmark: state.showBookmark,
        selectedTags: state.selectedTags
    })))

    const items = tags.map((tag) => ({key: tag.id, value: tag.label}))

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
            <TagCombobox data={items} selectedItems={[selectedTags, updateSelectedTags]} />
            <Separator />
            <div>
                <Label>Afficher les articles ajoutés à ma veille</Label>
                <ToggleGroup
                    type="single"
                    className="m-2 gap-2 w-fit"
                    defaultValue="yes"
                    value={showBookmark}
                    onValueChange={updateShowBookmark}
                >
                    <ToggleGroupItem variant="outline" value="yes" aria-label="Afficher les articles ajoutés à ma veille">
                        Oui
                    </ToggleGroupItem>
                    <ToggleGroupItem variant="outline" value="no" aria-label="Cacher les articles ajoutés à ma veille">
                        Non
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    )
}
