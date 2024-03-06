import { create } from "zustand";

import { Item } from "@/Components/form/multiple-select";
import { Tag, Thread } from "@/types";

interface FilterState {
    tags: Tag[];
    search: string;
    showBookmark: string;
    selectedTags: Item[];
    defaultTags: Tag[];
    updateSearch: (search: string) => void;
    updateTags: (tags: Tag[]) => void;
    updateSelectedTags: (tags: Item[]) => void;
    updateShowBookmark: (show: string) => void;
    updateDefaultTags: (tags: Tag[]) => void;
    resetFilters: () => void;
}

export interface ThreadState {
    currentThread: Thread | null;
    threads: Thread[];
    changeCurrentThreadTo: (tread: Thread) => void;
    removeCurrentThread: () => void;
    setThreads: (threads: Thread[]) => void;
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
    updateTags: (tags) => set({ tags }),
    updateSelectedTags: (tags) => set({ selectedTags: tags }),
    updateShowBookmark: (show) => set({ showBookmark: show }),
    updateDefaultTags: (tags) => set({ defaultTags: tags }),
    changeCurrentThreadTo: (thread) => {
        set({
            currentThread: thread,
            search: "",
            selectedTags: [],
        });
    },
    removeCurrentThread: () => {
        set({
            currentThread: null,
            search: "",
            selectedTags: get().defaultTags.map((tag) => ({
                key: tag.id,
                value: tag.label,
            })),
        });
    },
    setThreads: (threads) => set({ threads }),
    resetFilters: () => {
        set({
            search: "",
            selectedTags: [],
            currentThread: null,
        });
    },
}));
