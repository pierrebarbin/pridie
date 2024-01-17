import {create} from "zustand";
import {Tag, Thread} from "@/types";
import {Item} from "@/Components/form/multiple-select";

interface FilterState {
    tags: Array<Tag>
    search: string
    showBookmark: string
    selectedTags: Array<Item>
    defaultTags: Array<Tag>
    updateSearch: (search: string) => void
    updateTags: (tags: Array<Tag>) => void
    updateSelectedTags: (tags: Array<Item>) => void
    updateShowBookmark: (show: string) => void
    updateDefaultTags: (tags: Array<Tag>) => void
    resetFilters: () => void
}

export interface ThreadState {
    currentThread: Thread|null
    threads: Array<Thread>
    changeCurrentThreadTo: (tread: Thread) => void
    removeCurrentThread: () => void
    setThreads: (threads: Array<Thread>) => void
}

export const useFilterStore = create<FilterState & ThreadState>((set, get) => ({
    currentThread: null,
    threads: [],
    tags: [],
    defaultTags: [],
    search: "",
    showBookmark: "yes",
    selectedTags: [],
    updateSearch: (search) => set({ search }),
    updateTags: (tags) => set({tags}),
    updateSelectedTags: (tags) => set({selectedTags: tags}),
    updateShowBookmark: (show) => set({showBookmark: show}),
    updateDefaultTags: (tags) => set({defaultTags: tags}),
    changeCurrentThreadTo: (thread) => {
        set({
            currentThread: thread,
            search: "",
            selectedTags: []
        })
    },
    removeCurrentThread: () => {
        set({
            currentThread: null,
            search: "",
            selectedTags: get().defaultTags.map((tag) => ({key: tag.id, value: tag.label})),
        })
    },
    setThreads: (threads) => set({ threads }),
    resetFilters: () => {
        set({
            search: "",
            selectedTags: [],
            currentThread: null
        })
    }
}))
