import {Label} from "@/Components/ui/label";
import {Input} from "@/Components/ui/input";
import {Separator} from "@/Components/ui/separator";
import TagCombobox from "@/Components/form/tag-combobox";
import {ToggleGroup, ToggleGroupItem} from "@/Components/ui/toggle-group";
import React from "react";
import {Item} from "@/Components/form/multiple-select";

interface ArticleFiltersProps {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    items: Array<Item>
    selectedTags: [Array<Item>, React.Dispatch<React.SetStateAction<Array<Item>>>]
    showBookmark: string
    setShowBookmark: React.Dispatch<React.SetStateAction<string>>
}

export default function ArticleFilters({
    search,
    setSearch,
    items,
    selectedTags,
    showBookmark,
    setShowBookmark
}: ArticleFiltersProps) {
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
                        setSearch(e.target.value)
                    }}
                />
            </div>
            <Separator />
            <TagCombobox data={items} selectedItems={selectedTags} />
            <Separator />
            <div>
                <Label>Afficher les articles ajoutés à ma veille</Label>
                <ToggleGroup
                    type="single"
                    className="m-2 gap-2 w-fit"
                    defaultValue="yes"
                    value={showBookmark}
                    onValueChange={setShowBookmark}
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
