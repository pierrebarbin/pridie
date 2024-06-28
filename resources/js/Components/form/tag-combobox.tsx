import { UIEvent, useCallback } from "react"

import {
    Item,
    MultipleSelect,
    MultipleSelectBadge,
    MultipleSelectDropdown,
    MultipleSelectDropdownItem,
    MultipleSelectInput,
    MultipleSelectLabel,
    useMultipleSelect,
    useMultipleSelectProps,
} from "@/Components/form/multiple-select"
import { Button } from "@/Components/ui/button"
import { useDebounceCallback } from "@/Hooks/use-debounce-callback"
import { cn } from "@/lib/utils"
import {X} from "lucide-react";

interface TagComboboxProps extends useMultipleSelectProps {
    onSelectedItems?: (items: Item[]) => void
    onSearch?: (value: string) => void
    onEndReached?: () => void
}

export default function TagCombobox({
    data,
    selectedItems: controlledSelectedItems,
    initialSelectedItems,
    onSelectedItems,
    onSearch,
    onEndReached,
}: TagComboboxProps) {
    const debounceCallback = useCallback((value: string) => {
        onSearch && onSearch(value)
    }, [])

    const debounced = useDebounceCallback(debounceCallback)

    const {
        getLabelProps,
        getSelectedItemProps,
        selectedItems,
        removeSelectedItem,
        getInputProps,
        getDropdownProps,
        isOpen,
        getMenuProps,
        getItemProps,
        highlightedIndex,
        items,
    } = useMultipleSelect({
        data,
        initialSelectedItems,
        selectedItems: controlledSelectedItems,
        onSelectedItems,
        remoteSearch: true,
        onInput: debounced,
    })

    const handleScroll = (e: UIEvent<HTMLUListElement>) => {
        const target = e.target as HTMLUListElement
        const bottom =
            target.scrollHeight - target.scrollTop < target.clientHeight + 20
        if (bottom) {
            onEndReached && onEndReached()
        }
    }

    return (
        <MultipleSelect className="w-full">
            <MultipleSelectLabel {...getLabelProps()}>Tags</MultipleSelectLabel>
            <MultipleSelectInput
                placeholder="Recherchez un tag..."
                className="mt-2 w-full"
                {...getInputProps(
                    getDropdownProps({ preventKeyAction: isOpen }),
                )}
            />
            <div
                className={cn(
                    "inline-flex flex-wrap items-center gap-2 p-1.5",
                    selectedItems.length === 0 && "hidden",
                )}
            >
                {selectedItems.map(
                    function renderSelectedItem(selectedItemForRender, index) {
                        return (
                            <MultipleSelectBadge
                                key={`selected-item-${index}`}
                                {...getSelectedItemProps({
                                    selectedItem: selectedItemForRender,
                                    index,
                                })}
                            >
                                {selectedItemForRender.value}
                                <Button
                                    type="button"
                                    className="h-auto p-1"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeSelectedItem(
                                            selectedItemForRender,
                                        )
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </MultipleSelectBadge>
                        )
                    },
                )}
            </div>
            <MultipleSelectDropdown
                className={cn(
                    "max-h-32",
                    !(isOpen && items.length) && "hidden",
                )}
                onScroll={handleScroll}
                {...getMenuProps()}
            >
                {items.map((item, index) => (
                    <MultipleSelectDropdownItem
                        highlighted={highlightedIndex === index}
                        key={`${item.value}${index}`}
                        {...getItemProps({ item, index })}
                    >
                        <span>{item.value}</span>
                    </MultipleSelectDropdownItem>
                ))}
            </MultipleSelectDropdown>
        </MultipleSelect>
    )
}
