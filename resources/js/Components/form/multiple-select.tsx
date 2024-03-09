import { useCombobox, useMultipleSelection } from "downshift"
import { useMemo, useState } from "react"
import * as React from "react"

import { Badge, BadgeProps } from "@/Components/ui/badge"
import { Input, InputProps } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { cn } from "@/lib/utils"

export interface Item {
    key: string
    value: string
}

type Action = (
    items: Item[],
) => void | React.Dispatch<React.SetStateAction<Item[]>>

export interface useMultipleSelectProps {
    data: Item[]
    initialSelectedItems?: Item[]
    selectedItems?: [Item[], Action]
    onSelectedItems?: (items: Item[]) => void
    remoteSearch?: boolean
    onInput?: (value: string) => void
}

function getFilteredItems(
    items: Item[],
    selectedItems: Item[],
    inputValue: string,
) {
    const lowerCasedInputValue = inputValue.toLowerCase()

    return items.filter((item) => {
        return (
            !selectedItems.find((selected) => selected.key === item.key) &&
            item.value.toLowerCase().includes(lowerCasedInputValue)
        )
    })
}

const useMultipleSelect = ({
    data,
    initialSelectedItems,
    selectedItems: controlledSelectedItems,
    onSelectedItems,
    remoteSearch = false,
    onInput,
}: useMultipleSelectProps) => {
    const [inputValue, setInputValue] = useState("")
    const [selectedItems, setSelectedItems] =
        controlledSelectedItems ?? useState(initialSelectedItems ?? [])

    const items = useMemo(
        () =>
            remoteSearch
                ? data
                : getFilteredItems(data, selectedItems, inputValue),
        [remoteSearch, data, selectedItems, inputValue],
    )

    const multipleSelection = useMultipleSelection({
        selectedItems,
        onStateChange({ selectedItems: newSelectedItems, type }) {
            switch (type) {
                case useMultipleSelection.stateChangeTypes
                    .SelectedItemKeyDownBackspace:
                case useMultipleSelection.stateChangeTypes
                    .SelectedItemKeyDownDelete:
                case useMultipleSelection.stateChangeTypes
                    .DropdownKeyDownBackspace:
                case useMultipleSelection.stateChangeTypes
                    .FunctionRemoveSelectedItem:
                    setSelectedItems(newSelectedItems ?? [])
                    onSelectedItems && onSelectedItems(newSelectedItems ?? [])
                    break

                default:
                    break
            }
        },
    })

    const combobox = useCombobox({
        items,
        itemToString(item: Item | null) {
            return item ? item.value : ""
        },
        defaultHighlightedIndex: 0,
        selectedItem: null,
        inputValue,
        stateReducer(state, actionAndChanges) {
            const { changes, type } = actionAndChanges

            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    return {
                        ...changes,
                        isOpen: true,
                        highlightedIndex: 0,
                    }
                default:
                    return changes
            }
        },
        onStateChange({
            inputValue: newInputValue,
            type,
            selectedItem: newSelectedItem,
        }) {
            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (newSelectedItem) {
                        setSelectedItems([...selectedItems, newSelectedItem])
                        onSelectedItems &&
                            onSelectedItems([...selectedItems, newSelectedItem])
                        setInputValue("")
                        onInput && onInput("")
                    }
                    break

                case useCombobox.stateChangeTypes.InputChange:
                    setInputValue(newInputValue ?? "")
                    onInput && onInput(newInputValue ?? "")
                    break
                default:
                    break
            }
        },
    })

    return { ...multipleSelection, ...combobox, items }
}

export type MultipleSelectProps = React.HTMLAttributes<HTMLDivElement>

const MultipleSelect = React.forwardRef<HTMLDivElement, MultipleSelectProps>(
    ({ className, children, ...props }, ref) => (
        <div className={cn("relative", className)} ref={ref} {...props}>
            {children}
        </div>
    ),
)
MultipleSelect.displayName = "MultipleSelect"

export type MultipleSelectLabelProps =
    React.LabelHTMLAttributes<HTMLLabelElement>

const MultipleSelectLabel = React.forwardRef<
    HTMLLabelElement,
    MultipleSelectLabelProps
>(({ className, children, ...props }, ref) => (
    <Label className={cn("w-fit")} {...props}>
        {children}
    </Label>
))
MultipleSelectLabel.displayName = "MultipleSelectLabel"

export type MultipleSelectBadgeProps = BadgeProps

const MultipleSelectBadge = React.forwardRef<
    HTMLDivElement,
    MultipleSelectBadgeProps
>(({ className, variant, ...props }, ref) => (
    <Badge
        className={cn("flex items-center gap-2 pr-0.5", className)}
        variant="outline"
        {...props}
    />
))
MultipleSelectBadge.displayName = "MultipleSelectBadge"

export type MultipleSelectInputProps = InputProps

const MultipleSelectInput = React.forwardRef<
    HTMLInputElement,
    MultipleSelectInputProps
>(({ className, children, ...props }, ref) => (
    <Input className={cn("w-full", className)} ref={ref} {...props} />
))
MultipleSelectInput.displayName = "MultipleSelectInput"

export type MultipleSelectDropdownProps = React.HTMLAttributes<HTMLUListElement>

const MultipleSelectDropdown = React.forwardRef<
    HTMLUListElement,
    MultipleSelectDropdownProps
>(({ className, children, ...props }, ref) => (
    <ul
        className={cn(
            "absolute z-50 max-h-96 min-w-[8rem] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
        )}
        ref={ref}
        {...props}
    >
        {children}
    </ul>
))
MultipleSelectDropdown.displayName = "MultipleSelectDropdown"

export interface MultipleSelectDropdownItemProps
    extends React.HTMLAttributes<HTMLLIElement> {
    highlighted?: boolean
}

const MultipleSelectDropdownItem = React.forwardRef<
    HTMLLIElement,
    MultipleSelectDropdownItemProps
>(({ className, children, highlighted = false, ...props }, ref) => (
    <li
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            highlighted && "bg-accent",
            className,
        )}
        ref={ref}
        {...props}
    >
        {children}
    </li>
))
MultipleSelectDropdownItem.displayName = "MultipleSelectDropdownItem"

export {
    useMultipleSelect,
    MultipleSelect,
    MultipleSelectLabel,
    MultipleSelectBadge,
    MultipleSelectInput,
    MultipleSelectDropdown,
    MultipleSelectDropdownItem,
}
