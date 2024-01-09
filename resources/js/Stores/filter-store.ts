import {create} from "zustand";
import {Tag, Thread} from "@/types";
import {Item} from "@/Components/form/multiple-select";

interface FilterState {
    tags: Array<Tag>
    search: string
    showBookmark: string
    selectedTags: Array<Item>
    updateSearch: (search: string) => void
    updateTags: (tags: Array<Tag>) => void
    updateSelectedTags: (tags: Array<Item>) => void
    updateShowBookmark: (show: string) => void
    resetFilters: () => void
}

export interface ThreadState {
    currentThread: Thread|null
    threads: Array<Thread>
    changeCurrentThreadTo: (tread: Thread) => void
    removeCurrentThread: () => void
    setThreads: (threads: Array<Thread>) => void
}

export const useFilterStore = create<FilterState & ThreadState>((set) => ({
    currentThread: null,
    threads: [],
    tags: [],
    search: "",
    showBookmark: "yes",
    selectedTags: [],
    updateSearch: (search) => set({ search }),
    updateTags: (tags) => set({tags}),
    updateSelectedTags: (tags) => set({selectedTags: tags}),
    updateShowBookmark: (show) => set({showBookmark: show}),
    changeCurrentThreadTo: (thread) => set({ currentThread: thread }),
    removeCurrentThread: () => set({ currentThread: null }),
    setThreads: (threads) => set({ threads }),
    resetFilters: () => {
        set({
            search: "",
            selectedTags: [],
            currentThread: null
        })
    }
}))
