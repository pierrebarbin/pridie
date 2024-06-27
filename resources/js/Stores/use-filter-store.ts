// Mimic the hook returned by `create`
import { useContext } from 'react'
import { useStore } from 'zustand'
import {FilterContext, FilterState, ThreadState} from "@/Stores/filter-store";

export function useFilterStoreContext<T>(selector: (state: FilterState & ThreadState) => T): T {
    const store = useContext(FilterContext)
    if (!store) throw new Error('Missing FilterContext.Provider in the tree')
    return useStore(store, selector)
}
