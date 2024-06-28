import { createContext } from 'react'
import {createStore, StoreApi} from "zustand"

import { Item } from "@/Components/form/multiple-select"
import { Tag, Thread } from "@/types"

interface FilterProps {
    search: string
    showBookmark: string
    selectedTags: Item[]
    defaultTags: Tag[]
}

export interface FilterState extends FilterProps {
    updateSearch: (search: string) => void
    updateSelectedTags: (tags: Item[]) => void
    updateShowBookmark: (show: string) => void
    updateDefaultTags: (tags: Tag[]) => void
    resetFilters: () => void
}

interface ThreadProps {
    currentThread: Thread | null
}

export interface ThreadState extends  ThreadProps{
    changeCurrentThreadTo: (tread: Thread) => void
    removeCurrentThread: () => void
}

export const createFilterStore = (initProps?: Partial<FilterProps & ThreadProps>) => {
    const DEFAULT_PROPS: FilterProps & ThreadProps = {
        currentThread: null,
        defaultTags: [],
        search: "",
        showBookmark: "yes",
        selectedTags: [],
    }
    return createStore<FilterState & ThreadState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        updateSearch: (search) => set({ search }),
        updateSelectedTags: (tags) => set({ selectedTags: tags }),
        updateShowBookmark: (show) => set({ showBookmark: show }),
        updateDefaultTags: (tags) => set({ defaultTags: tags }),
        changeCurrentThreadTo: (thread) => {
            set({
                currentThread: thread,
                search: "",
                selectedTags: [],
            })
        },
        removeCurrentThread: () => {
            set({
                currentThread: null,
                search: "",
                selectedTags: get().defaultTags.map((tag) => ({
                    key: tag.id,
                    value: tag.label,
                })),
            })
        },
        resetFilters: () => {
            set({
                search: "",
                selectedTags: [],
                currentThread: null,
            })
        },
    }))
}

export const FilterContext = createContext<StoreApi<FilterState & ThreadState> | null>(null)
