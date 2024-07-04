import { createContext } from "react"
import { createStore, StoreApi } from "zustand"

import { Item } from "@/Components/form/multiple-select"
import { Tag, Thread } from "@/types"

interface DefaultValuesProps {
    defaultTags: Tag[]
}

type DefaultValuesState = DefaultValuesProps

interface ConfigProps {
    useDefaultTags: boolean
    alwaysDisplayAdvancedFilters: boolean
}

interface ConfigState extends ConfigProps {
    updateUseDefaultTags: (value: boolean) => void
    updateAlwaysDisplayAdvancedFilters: (value: boolean) => void
}

interface FilterProps {
    search: string
    showBookmark: string
    selectedTags: Item[]
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

export interface ThreadState extends ThreadProps {
    changeCurrentThreadTo: (tread: Thread) => void
    removeCurrentThread: () => void
}

export type AppProps = FilterProps &
    ThreadProps &
    DefaultValuesProps &
    ConfigProps
export type AppState = FilterState &
    ThreadState &
    DefaultValuesState &
    ConfigState

export const createAppStore = (initProps?: Partial<AppProps>) => {
    const DEFAULT_PROPS: AppProps = {
        useDefaultTags: true,
        alwaysDisplayAdvancedFilters: false,
        currentThread: null,
        defaultTags: [],
        selectedTags: [],
        search: "",
        showBookmark: "yes",
    }
    return createStore<AppState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        updateSearch: (search) => set({ search }),
        updateSelectedTags: (tags) => set({ selectedTags: tags }),
        updateShowBookmark: (show) => set({ showBookmark: show }),
        updateDefaultTags: (tags) => set({ defaultTags: tags }),
        updateUseDefaultTags: (value) => set({ useDefaultTags: value }),
        updateAlwaysDisplayAdvancedFilters: (value) => set({ alwaysDisplayAdvancedFilters: value }),
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

export const AppContext = createContext<StoreApi<AppState> | null>(null)
