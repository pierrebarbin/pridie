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
import {useUpdateEffect} from "@/Hooks/use-updated-effect";

interface TagComboboxProps extends useMultipleSelectProps {
    onItemSelected?: (items: Array<Item>) => void
}

export default function TagCombobox({
    data,
    selectedItems: controlledSelectedItems,
    initialSelectedItems,
    onItemSelected
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
        selectedItems: controlledSelectedItems
    })

    useUpdateEffect(() => {
        onItemSelected && onItemSelected(selectedItems)
    }, [selectedItems])

    return (
        <MultipleSelect>
            <div className="flex flex-col gap-1">
                <MultipleSelectLabel {...getLabelProps()}>
                    Tags
                </MultipleSelectLabel>
                <div className="inline-flex gap-2 items-center flex-wrap p-1.5">
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
                    <div className="flex grow">
                        <MultipleSelectInput
                            placeholder="Ajouter un tag"
                            className="w-full"
                            {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
                        />
                    </div>
                </div>
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
