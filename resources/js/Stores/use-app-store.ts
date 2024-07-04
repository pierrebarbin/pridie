import { useContext } from "react"
import { useStore } from "zustand"

import { AppContext, AppState } from "@/Stores/filter-store"

export function useAppStoreContext<T>(selector: (state: AppState) => T): T {
    const store = useContext(AppContext)
    if (!store) throw new Error("Missing AppContext.Provider in the tree")
    return useStore(store, selector)
}
