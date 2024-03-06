import {cn} from "@/lib/utils";
import {
    Item,
    MultipleSelect, MultipleSelectBadge, MultipleSelectDropdown, MultipleSelectDropdownItem, MultipleSelectInput,
    MultipleSelectLabel,
    useMultipleSelect,
    useMultipleSelectProps
} from "@/Components/form/multiple-select";
import {Cross2Icon} from "@radix-ui/react-icons";
import {Button} from "@/Components/ui/button";
import React from "react";

interface TagComboboxProps extends useMultipleSelectProps {
    onSelectedItems?: (items: Item[]) => void
}

export default function TagCombobox({
    data,
    selectedItems: controlledSelectedItems,
    initialSelectedItems,
    onSelectedItems
}: TagComboboxProps) {

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
        items
    } = useMultipleSelect({
        data,
        initialSelectedItems,
        selectedItems: controlledSelectedItems,
        onSelectedItems
    })

    return (
        <MultipleSelect className="w-full">
            <MultipleSelectLabel {...getLabelProps()}>
                Tags
            </MultipleSelectLabel>
            <MultipleSelectInput
                placeholder="Recherchez un tag..."
                className="w-full mt-2"
                {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
            />
            <div className={cn(
                "inline-flex gap-2 items-center flex-wrap p-1.5",
                selectedItems.length === 0 && "hidden"
            )}>
                {selectedItems.map(function renderSelectedItem(
                    selectedItemForRender,
                    index,
                ) {
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
                                onClick={e => {
                                    e.stopPropagation()
                                    removeSelectedItem(selectedItemForRender)
                                }}
                            >
                                <Cross2Icon className="w-4 h-4" />
                            </Button>
                        </MultipleSelectBadge>
                    )
                })}
            </div>
            <MultipleSelectDropdown className={cn(!(isOpen && items.length) && 'hidden')} {...getMenuProps()}>
                {isOpen && items.map((item, index) => (
                    <MultipleSelectDropdownItem
                        highlighted={highlightedIndex === index}
                        key={`${item.value}${index}`}
                        {...getItemProps({item, index})}
                    >
                        <span>{item.value}</span>
                    </MultipleSelectDropdownItem>
                ))}
            </MultipleSelectDropdown>
        </MultipleSelect>
    )
}
