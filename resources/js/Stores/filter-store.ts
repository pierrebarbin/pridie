import { create } from "zustand";

import { Item } from "@/Components/form/multiple-select";
import { Pagination, Tag, Thread } from "@/types";

interface FilterState {
    search: string;
    showBookmark: string;
    selectedTags: Item[];
    defaultTags: Tag[];
    updateSearch: (search: string) => void;
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
    defaultTags: [],
    search: "",
    showBookmark: "yes",
    selectedTags: [],
    updateSearch: (search) => set({ search }),
    updateSelectedTags: (tags) => set({ selectedTags: tags }),
    updateTagsMeta: (meta) => set({tagsMeta: meta}),
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
