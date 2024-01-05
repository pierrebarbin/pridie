export interface User {
    id: string
    name: string
    email: string
    email_verified_at: string
}

export interface Article {
    id:  string
    title: string
    content: string
    bookmarked?: boolean
    reactions: Array<{
        id: string
        count: number
    }>
    user_reactions: Array<{
        id: string
    }>
    created_at: string
}

interface Tag {
    id: string
    label: string
}

interface Reaction {
    id: string
    image: string
}

interface Thread {
    id: string
    name: string
    created_at: string
}

export interface Pagination<T> {
    data: Array<T>
    links: {
        first: string
        last: string
        next: string|null
        prev: string|null
    }
    meta: {
      current_page: number
      from: number
      last_page: number
      per_page: number
      to: number
      total: number
    }
}

export interface CursorPagination<T> {
    data: Array<T>
    links: {
        first: string
        last: string
        next: string|null
        prev: string|null
    }
    meta: {
        path: string
        next_cursor: string
        prev_cursor: string
        per_page: number
    }
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
