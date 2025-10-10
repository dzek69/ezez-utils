/**
 * Returns a new array with unique values of given array.
 * @param arr - source array
 * @example unique([1, 2, 3, 2, 1]) // [1, 2, 3]
 */
const unique = <T>(arr: T[]): T[] => {
    return [...new Set(arr)];
};

export {
    unique,
};
