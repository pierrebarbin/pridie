import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";

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
} from "@/Components/form/multiple-select";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

interface TagComboboxProps extends useMultipleSelectProps {
    onSelectedItems?: (items: Item[]) => void
    onEndReached?: () => void
}

export default function TagCombobox({
    data,
    selectedItems: controlledSelectedItems,
    initialSelectedItems,
    onSelectedItems,
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
        items,
    } = useMultipleSelect({
        data,
        initialSelectedItems,
        selectedItems: controlledSelectedItems,
        onSelectedItems,
    });

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
                                        e.stopPropagation();
                                        removeSelectedItem(
                                            selectedItemForRender,
                                        );
                                    }}
                                >
                                    <Cross2Icon className="h-4 w-4" />
                                </Button>
                            </MultipleSelectBadge>
                        );
                    },
                )}
            </div>
            <MultipleSelectDropdown
                className={cn(!(isOpen && items.length) && "hidden")}
                {...getMenuProps()}
            >
                {isOpen
                    ? items.map((item, index) => (
                          <MultipleSelectDropdownItem
                              highlighted={highlightedIndex === index}
                              key={`${item.value}${index}`}
                              {...getItemProps({ item, index })}
                          >
                              <span>{item.value}</span>
                          </MultipleSelectDropdownItem>
                      ))
                    : null}
            </MultipleSelectDropdown>
        </MultipleSelect>
    );
}
