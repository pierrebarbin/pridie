export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Article {
    id:  string
    title: string
    content: string,
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

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
