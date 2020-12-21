

export interface Comparable<T> {
    compare_to(obj: T): number;
}