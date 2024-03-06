import { create } from "zustand";

import { Article } from "@/types";

interface ArticleCreationState {
    article: Partial<Article> | null;
    updateArticle: (article: Partial<Article> | null) => void;
}

export const useArticleCreationStore = create<ArticleCreationState>(
    (set, get) => ({
        article: null,
        updateArticle: (article) => {
            if (!article) {
                set({ article: null });
            }
            set({ article: { ...get().article, ...article } });
        },
    }),
);
