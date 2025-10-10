/**
 * Finds most frequent value in array
 * @param {Array} array
 */
const mostFrequent = <T>(array: T[]): T => {
    let top = 0,
        topValue = array[0];

    const map = new Map<T, number>();
    array.forEach(value => {
        if (!map.has(value)) {
            map.set(value, 0);
        }
        const next = map.get(value)! + 1;
        map.set(value, map.get(value)! + 1);
        if (next > top) {
            top = next;
            topValue = value;
        }
    });

    // @ts-expect-error - idk if there is a good workaround for this with `noUncheckedIndexedAccess`
    return topValue;
};

export {
    mostFrequent,
};
