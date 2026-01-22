/* eslint-disable @typescript-eslint/no-magic-numbers */

/**
 * Returns a function that can be used as a callback to `.sort()` method. Returned function will sort array by given
 * properties.
 *
 * @param propertyNames - name of the properties to sort by, in order of priority
 * @param ascending - should sort be ascending? Pass boolean or object with boolean values for each property
 * @param defaultValues - values to use when properties are not defined in one of the objects
 *
 * @example:
 * ```
 * const videos = [
 *   { height: 480, bitrate: 300 },
 *   { height: 720, bitrate: 100 },
 *   { height: 720 },
 *   { height: 720, bitrate: 200 },
 * ];
 * // Sort by height ascending, then by bitrate descending, and set default bitrate to 150
 * itemsMissing.sort(sortByMultiple(["height", "bitrate"], { height: true, bitrate: false }, { bitrate: 150 }));
 * // Result:
 * [
 *   { height: 480, bitrate: 300 },
 *   { height: 720, bitrate: 200 },
 *   { height: 720 }, // bitrate assumed to be 150
 *   { height: 720, bitrate: 100 },
 * ]
 * ```
 */
const sortByMultiple = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends Record<string | number | symbol, any>,
    K extends Array<keyof T>,
>(
    propertyNames: K,
    ascending: boolean | Record<K[number], boolean> = true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues?: Partial<Record<K[number], any>>, // Force defaultValues to use only keys from K
): ((a: T, b: T) => 1 | -1 | 0) => (a: T, b: T): 1 | -1 | 0 => {
    for (const propertyName of propertyNames) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const asc = typeof ascending === "boolean" ? ascending : (ascending[propertyName] ?? true);
        const aBiggerValue = asc ? 1 : -1;
        const bBiggerValue = asc ? -1 : 1;

        const aValue = a[propertyName] ?? defaultValues?.[propertyName];
        const bValue = b[propertyName] ?? defaultValues?.[propertyName];

        if (aValue !== bValue) {
            // @ts-expect-error Too dynamic for TS
            return (aValue > bValue ? aBiggerValue : bBiggerValue);
        }
    }
    return 0;
};

export {
    sortByMultiple,
};
