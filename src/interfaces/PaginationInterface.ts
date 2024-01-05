export interface PaginationInfo<T> {
    currentPage: number;
    limit: number;
    totalItems: number;
    pages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    items?: T;
}
