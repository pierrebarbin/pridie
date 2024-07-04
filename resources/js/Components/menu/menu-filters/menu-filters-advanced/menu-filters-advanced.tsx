import {Label} from "@/Components/ui/label";
import {ToggleGroup, ToggleGroupItem} from "@/Components/ui/toggle-group";
import {useAppStoreContext} from "@/Stores/use-app-store";

export default function MenuFiltersAdvanced() {

    const showBookmark = useAppStoreContext((state) => state.showBookmark)

    const updateShowBookmark = useAppStoreContext(
        (state) => state.updateShowBookmark,
    )

    return (
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
    )
}
