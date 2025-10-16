type MatchCallback<T> = (value: T) => boolean;

/**
 * A `Array.prototype.filter`-like function that splits the results into two groups - matched and unmatched
 * @param {Array} list - original array
 * @param {function} fn - function matching elements
 * @deprecated - use `Map.groupBy` instead for even more robustness
 */
const match = <T>(list: T[], fn: MatchCallback<T>): { matched: T[]; unmatched: T[] } => {
    const matched: T[] = [];
    const unmatched: T[] = [];
    list.forEach(item => {
        if (fn(item)) {
            matched.push(item);
            return;
        }
        unmatched.push(item);
    });

    return {
        matched,
        unmatched,
    };
};

export {
    match,
};
export type {
    MatchCallback,
};
