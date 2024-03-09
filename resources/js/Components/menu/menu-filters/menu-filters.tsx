import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import TagCombobox from "@/Components/form/tag-combobox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group";
import { useFilterStore } from "@/Stores/filter-store";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { CursorPagination, Tag } from "@/types";

export default function MenuFilters() {
    const [tagSearch, setTagSearch] = useState("")

    const {
        search,
        updateSearch,
        updateSelectedTags,
        showBookmark,
        selectedTags,
        updateShowBookmark,
    } = useFilterStore(
        useShallow((state) => ({
            search: state.search,
            updateSearch: state.updateSearch,
            updateSelectedTags: state.updateSelectedTags,
            updateShowBookmark: state.updateShowBookmark,
            showBookmark: state.showBookmark,
            selectedTags: state.selectedTags,
        })),
    );

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
      } = useInfiniteQuery<CursorPagination<Tag>>({
        queryKey: ["tags", {tagSearch}],
        queryFn: async ({ pageParam }) => {
            const params = {
                cursor: (pageParam as string),
                "filter[label]": tagSearch,
            };

            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([value]) => value !== ""),
            );

            const urlParams = new URLSearchParams(cleanParams);

            const result = await axios.get(`${route("api.tags")}?${urlParams.toString()}`)

            return result.data
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
      })

      const handleEndReached = () => {
        if (!hasNextPage || isFetchingNextPage) {
            return
        }
       fetchNextPage()
      }

    const rows = data ? data.pages.flatMap((d) => d.data) : [];

    const items = rows.map((tag) => ({ key: tag.id, value: tag.label }));

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
                        updateSearch(e.target.value);
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
    );
}
