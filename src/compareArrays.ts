import { unique } from "./unique.js";

/**
 * Compares two arrays and returns the items that are only in arrayA, only in arrayB, and in both arrays.
 * @param arrayA - first array
 * @param arrayB - second array
 * @returns an object with three properties:
 * onlyA - items that exists only in first array,
 * onlyB - items that exists only in second array,
 * both - items that exists in both arrays
 */
const compareArrays = <T>(arrayA: T[], arrayB: T[]): { onlyA: T[]; onlyB: T[]; both: T[] } => {
    const onlyA = unique(arrayA.filter((item) => !arrayB.includes(item)));
    const onlyB = unique(arrayB.filter((item) => !arrayA.includes(item)));
    const both = unique(arrayA.filter((item) => arrayB.includes(item)));
    return { onlyA, onlyB, both };
};

export {
    compareArrays,
};
